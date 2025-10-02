"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const crypto = __importStar(require("crypto"));
const mailer_service_1 = require("../mailer/mailer.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const email_login_challenge_entity_1 = require("./email-login-challenge.entity");
const enums_1 = require("../common/enums");
const CHALLENGE_TTL_MIN = 15;
const RESEND_COOLDOWN_SEC = 60;
const MAX_SEND_IN_HOUR = 3;
const MAX_VERIFY_WRONG = 5;
let AuthService = class AuthService {
    constructor(usersRepo, challengeRepo, jwt, mailer) {
        this.usersRepo = usersRepo;
        this.challengeRepo = challengeRepo;
        this.jwt = jwt;
        this.mailer = mailer;
    }
    norm(s) {
        const v = (s ?? '').trim();
        return v.length ? v : undefined;
    }
    generateSessionToken() {
        return crypto.randomBytes(32).toString('hex');
    }
    tooMany(msg = 'Too many requests') {
        throw new common_1.HttpException(msg, common_1.HttpStatus.TOO_MANY_REQUESTS);
    }
    async signAccessToken(payload) {
        return this.jwt.signAsync(payload, {
            secret: process.env.JWT_SECRET || 'dev_secret',
            expiresIn: '7d',
        });
    }
    async signRefreshToken(payload) {
        return this.jwt.signAsync(payload, {
            secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev_secret',
            expiresIn: '30d',
        });
    }
    setAuthCookies(res, accessToken, refreshToken) {
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('access_token', accessToken, {
            httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 30 * 24 * 60 * 60 * 1000,
        });
    }
    async registerSupportAdmin(dto) {
        const email = dto.email.toLowerCase().trim();
        const exists = await this.usersRepo.findOne({ where: { email }, select: { id: true } });
        if (exists)
            throw new common_1.BadRequestException('Email đã tồn tại');
        if (!dto.password || dto.password.length < 6) {
            throw new common_1.BadRequestException('Mật khẩu tối thiểu 6 ký tự');
        }
        const hash = await bcrypt.hash(dto.password, 10);
        const u = this.usersRepo.create({
            email,
            passwordHash: hash,
            firstName: this.norm(dto.firstName) ?? '',
            lastName: this.norm(dto.lastName) ?? '',
            phone: this.norm(dto.phone) ?? null,
            address: this.norm(dto.address) ?? null,
            img: this.norm(dto.img) ?? null,
            role: enums_1.UserRole.SUPPORT_ADMIN,
            sessionVersion: 0,
        });
        const saved = await this.usersRepo.save(u);
        const { passwordHash, sessionVersion, ...safe } = saved;
        return safe;
    }
    async login(dto) {
        const email = dto.email.toLowerCase().trim();
        const user = await this.usersRepo.findOne({
            where: { email },
            select: {
                id: true, email: true, passwordHash: true, role: true,
                firstName: true, lastName: true, phone: true, address: true, sessionVersion: true,
            },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng');
        const isBcrypt = /^\$2[aby]\$/.test(user.passwordHash || '');
        let ok = false;
        if (isBcrypt) {
            ok = await bcrypt.compare(dto.password, user.passwordHash);
        }
        else {
            if (dto.password === user.passwordHash) {
                const newHash = await bcrypt.hash(dto.password, 10);
                await this.usersRepo.update({ id: user.id }, { passwordHash: newHash });
                ok = true;
            }
        }
        if (!ok)
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng');
        const sessionToken = this.generateSessionToken();
        await this.usersRepo.update({ id: user.id }, {
            session: sessionToken,
            sessionVersion: (user.sessionVersion ?? 0) + 1,
        });
        const sv = (user.sessionVersion ?? 0) + 1;
        const accessToken = await this.signAccessToken({ sub: user.id, email: user.email, role: user.role, sv });
        const refreshToken = await this.signRefreshToken({ sub: user.id, sv });
        return {
            accessToken,
            refreshToken,
            sessionToken,
            user: {
                id: user.id, email: user.email, role: user.role,
                firstName: user.firstName, lastName: user.lastName, phone: user.phone, address: user.address,
            },
        };
    }
    async adminUpdateSupport(id, dto) {
        const target = await this.usersRepo.findOne({
            where: { id }, select: { id: true, role: true, email: true, sessionVersion: true },
        });
        if (!target)
            throw new common_1.NotFoundException('Không tìm thấy user');
        if (target.role !== enums_1.UserRole.SUPPORT_ADMIN) {
            throw new common_1.BadRequestException('Chỉ sửa được tài khoản Support Admin');
        }
        const patch = {
            firstName: this.norm(dto.firstName),
            lastName: this.norm(dto.lastName),
            phone: this.norm(dto.phone) ?? null,
            address: this.norm(dto.address) ?? null,
        };
        if (dto.password && dto.password.length >= 6) {
            patch.passwordHash = await bcrypt.hash(dto.password, 10);
            patch.sessionVersion = (target.sessionVersion || 0) + 1;
        }
        await this.usersRepo.update({ id }, patch);
        const updated = await this.usersRepo.findOne({
            where: { id },
            select: { id: true, email: true, firstName: true, lastName: true, phone: true, address: true, role: true },
        });
        return updated;
    }
    async loginVerifyStart(dto, next, ip, ua) {
        const email = dto.email.toLowerCase().trim();
        const user = await this.usersRepo.findOne({
            where: { email },
            select: {
                id: true, email: true, passwordHash: true, role: true,
                lockedUntil: true, loginAttemptCount: true, lastLoginAttemptAt: true,
            },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng');
        const now = new Date();
        if (user.lockedUntil && user.lockedUntil > now) {
            this.tooMany('Tài khoản bị khoá tạm thời. Vui lòng thử lại sau.');
        }
        const isBcrypt = /^\$2[aby]\$/.test(user.passwordHash || '');
        let ok = false;
        if (isBcrypt)
            ok = await bcrypt.compare(dto.password, user.passwordHash);
        else if (dto.password === user.passwordHash) {
            const newHash = await bcrypt.hash(dto.password, 10);
            await this.usersRepo.update({ id: user.id }, { passwordHash: newHash });
            ok = true;
        }
        if (!ok)
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng');
        let attempt = user.loginAttemptCount || 0;
        if (!user.lastLoginAttemptAt || now.getTime() - user.lastLoginAttemptAt.getTime() >= 3600_000) {
            attempt = 0;
        }
        const sentInHour = await this.challengeRepo.count({
            where: { userId: user.id, createdAt: (0, typeorm_2.MoreThan)(new Date(now.getTime() - 3600_000)) },
        });
        if (sentInHour >= MAX_SEND_IN_HOUR || attempt >= MAX_SEND_IN_HOUR) {
            await this.usersRepo.update({ id: user.id }, { lockedUntil: new Date(now.getTime() + 3600_000), loginAttemptCount: 0, lastLoginAttemptAt: now });
            this.tooMany('Bạn đã thử quá nhiều lần, tài khoản bị khoá 1 giờ.');
        }
        const ch = await this.challengeRepo.save(this.challengeRepo.create({
            userId: user.id,
            codeHash: '',
            expiresAt: new Date(now.getTime() + CHALLENGE_TTL_MIN * 60 * 1000),
            ip, userAgent: ua, nextPath: next || '/',
            lastSentAt: new Date(now.getTime() - RESEND_COOLDOWN_SEC * 1000),
            sentCount: 0, verifyCount: 0,
        }));
        await this.usersRepo.update({ id: user.id }, { loginAttemptCount: attempt + 1, lastLoginAttemptAt: now });
        return { verifyRequired: true, challengeId: ch.id, resendAfterSec: 0 };
    }
    async loginVerifyResend(challengeId) {
        const now = new Date();
        const ch = await this.challengeRepo.findOne({ where: { id: challengeId }, relations: { user: true } });
        if (!ch)
            throw new common_1.BadRequestException('Challenge không hợp lệ');
        if (ch.usedAt || ch.expiresAt < now)
            throw new common_1.BadRequestException('Challenge đã hết hạn');
        const since = (now.getTime() - ch.lastSentAt.getTime()) / 1000;
        if (since < RESEND_COOLDOWN_SEC) {
            this.tooMany(`Vui lòng đợi ${Math.ceil(RESEND_COOLDOWN_SEC - since)}s để gửi lại.`);
        }
        const sentInHour = await this.challengeRepo.count({
            where: { userId: ch.userId, lastSentAt: (0, typeorm_2.MoreThan)(new Date(now.getTime() - 3600_000)) },
        });
        if (sentInHour >= MAX_SEND_IN_HOUR) {
            await this.usersRepo.update({ id: ch.userId }, { lockedUntil: new Date(now.getTime() + 3600_000), loginAttemptCount: 0, lastLoginAttemptAt: now });
            this.tooMany('Bạn đã thử quá nhiều lần, tài khoản bị khoá 1 giờ.');
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const codeHash = await bcrypt.hash(code, 10);
        await this.mailer.sendOtp(ch.user.email, code);
        await this.challengeRepo.update({ id: ch.id }, { codeHash, sentCount: (ch.sentCount || 0) + 1, lastSentAt: now });
        return { ok: true, resendAfterSec: RESEND_COOLDOWN_SEC };
    }
    async loginVerifyVerify(challengeId, code, res) {
        const now = new Date();
        const ch = await this.challengeRepo.findOne({ where: { id: challengeId }, relations: { user: true } });
        if (!ch)
            throw new common_1.BadRequestException('Challenge không hợp lệ');
        if (ch.usedAt || ch.expiresAt < now)
            throw new common_1.BadRequestException('Mã đã hết hạn hoặc challenge không hợp lệ');
        if ((ch.verifyCount ?? 0) >= MAX_VERIFY_WRONG) {
            await this.usersRepo.update({ id: ch.userId }, { lockedUntil: new Date(now.getTime() + 3600_000) });
            this.tooMany('Bạn nhập sai quá nhiều lần. Tài khoản bị khoá 1 giờ.');
        }
        const ok = await bcrypt.compare(String(code || ''), ch.codeHash || '');
        if (!ok) {
            await this.challengeRepo.update({ id: ch.id }, { verifyCount: (ch.verifyCount || 0) + 1 });
            throw new common_1.BadRequestException('Mã xác minh không đúng.');
        }
        await this.challengeRepo.update({ id: ch.id }, { usedAt: new Date() });
        const sessionToken = this.generateSessionToken();
        const newSv = (ch.user.sessionVersion ?? 0) + 1;
        await this.usersRepo.update({ id: ch.user.id }, {
            session: sessionToken,
            sessionVersion: newSv,
        });
        const accessToken = await this.signAccessToken({ sub: ch.user.id, email: ch.user.email, role: ch.user.role, sv: newSv });
        const refreshToken = await this.signRefreshToken({ sub: ch.user.id, sv: newSv });
        this.setAuthCookies(res, accessToken, refreshToken);
        return ch.nextPath || '/';
    }
    async logout(userId) {
        await this.usersRepo.update({ id: userId }, { session: null });
    }
    async forceLogoutByEmail(email) {
        const user = await this.usersRepo.findOne({
            where: { email: email.toLowerCase().trim() },
            select: { id: true, sessionVersion: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.usersRepo.update({ id: user.id }, {
            session: null,
            sessionVersion: (user.sessionVersion ?? 0) + 1,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(email_login_challenge_entity_1.EmailLoginChallenge)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        mailer_service_1.MailerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map