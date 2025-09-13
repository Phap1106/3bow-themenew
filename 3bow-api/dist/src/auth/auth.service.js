"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const client_1 = require("@prisma/client");
const mailer_service_1 = require("../mailer/mailer.service");
const CHALLENGE_TTL_MIN = 15;
const RESEND_COOLDOWN_SEC = 60;
const MAX_SEND_IN_HOUR = 3;
const MAX_VERIFY_WRONG = 5;
let AuthService = class AuthService {
    constructor(prisma, jwt, mailer) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.mailer = mailer;
    }
    norm(s) {
        const v = (s !== null && s !== void 0 ? s : "").trim();
        return v.length ? v : undefined;
    }
    tooMany(msg = "Too many requests") {
        throw new common_1.HttpException(msg, common_1.HttpStatus.TOO_MANY_REQUESTS);
    }
    async signAccessToken(payload) {
        return this.jwt.signAsync(payload, {
            secret: process.env.JWT_SECRET || "dev_secret",
            expiresIn: "7d",
        });
    }
    async signRefreshToken(payload) {
        return this.jwt.signAsync(payload, {
            secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "dev_secret",
            expiresIn: "30d",
        });
    }
    setAuthCookies(res, accessToken, refreshToken) {
        const isProd = process.env.NODE_ENV === "production";
        res.cookie("access_token", accessToken, {
            httpOnly: true, sameSite: "lax", secure: isProd, path: "/", maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true, sameSite: "lax", secure: isProd, path: "/", maxAge: 30 * 24 * 60 * 60 * 1000,
        });
    }
    async registerSupportAdmin(dto) {
        var _a, _b, _c, _d;
        const email = dto.email.toLowerCase().trim();
        const exists = await this.prisma.user.findUnique({
            where: { email }, select: { id: true },
        });
        if (exists)
            throw new common_1.BadRequestException("Email đã tồn tại");
        if (!dto.password || dto.password.length < 6)
            throw new common_1.BadRequestException("Mật khẩu tối thiểu 6 ký tự");
        const hash = await bcrypt.hash(dto.password, 10);
        return this.prisma.user.create({
            data: {
                email,
                password: hash,
                firstName: (_a = this.norm(dto.firstName)) !== null && _a !== void 0 ? _a : "",
                lastName: (_b = this.norm(dto.lastName)) !== null && _b !== void 0 ? _b : "",
                phone: (_c = this.norm(dto.phone)) !== null && _c !== void 0 ? _c : null,
                address: (_d = this.norm(dto.address)) !== null && _d !== void 0 ? _d : null,
                role: client_1.UserRole.SUPPORT_ADMIN,
            },
            select: {
                id: true, email: true, role: true,
                firstName: true, lastName: true, phone: true, address: true,
            },
        });
    }
    async login(dto) {
        var _a;
        const email = dto.email.toLowerCase().trim();
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true, email: true, password: true, role: true,
                firstName: true, lastName: true, phone: true, address: true,
                sessionVersion: true,
            },
        });
        if (!user)
            throw new common_1.UnauthorizedException("Email hoặc mật khẩu không đúng");
        const ok = await bcrypt.compare(dto.password, user.password);
        if (!ok)
            throw new common_1.UnauthorizedException("Email hoặc mật khẩu không đúng");
        const sv = (_a = user.sessionVersion) !== null && _a !== void 0 ? _a : 0;
        const accessToken = await this.signAccessToken({
            sub: user.id, email: user.email, role: user.role, sv,
        });
        const refreshToken = await this.signRefreshToken({ sub: user.id, sv });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id, email: user.email, role: user.role,
                firstName: user.firstName, lastName: user.lastName,
                phone: user.phone, address: user.address,
            },
        };
    }
    async adminUpdateSupport(id, dto) {
        var _a, _b;
        const target = await this.prisma.user.findUnique({
            where: { id }, select: { id: true, role: true, email: true },
        });
        if (!target)
            throw new common_1.NotFoundException("Không tìm thấy user");
        if (target.role !== client_1.UserRole.SUPPORT_ADMIN)
            throw new common_1.BadRequestException("Chỉ sửa được tài khoản Support Admin");
        const data = {
            firstName: this.norm(dto.firstName),
            lastName: this.norm(dto.lastName),
            phone: (_a = this.norm(dto.phone)) !== null && _a !== void 0 ? _a : null,
            address: (_b = this.norm(dto.address)) !== null && _b !== void 0 ? _b : null,
        };
        if (dto.password && dto.password.length >= 6) {
            data.password = await bcrypt.hash(dto.password, 10);
            data.sessionVersion = { increment: 1 };
        }
        return this.prisma.user.update({
            where: { id }, data,
            select: {
                id: true, email: true, firstName: true, lastName: true, phone: true, address: true, role: true,
            },
        });
    }
    async loginVerifyStart(dto, next, ip, ua) {
        const email = dto.email.toLowerCase().trim();
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true, email: true, password: true, role: true,
                lockedUntil: true, loginAttemptCount: true, lastLoginAttemptAt: true,
            },
        });
        if (!user)
            throw new common_1.UnauthorizedException("Email hoặc mật khẩu không đúng");
        const now = new Date();
        if (user.lockedUntil && user.lockedUntil > now)
            this.tooMany("Tài khoản bị khoá tạm thời. Vui lòng thử lại sau.");
        const ok = await bcrypt.compare(dto.password, user.password);
        if (!ok)
            throw new common_1.UnauthorizedException("Email hoặc mật khẩu không đúng");
        let attempt = user.loginAttemptCount || 0;
        if (!user.lastLoginAttemptAt || now.getTime() - user.lastLoginAttemptAt.getTime() >= 3600000)
            attempt = 0;
        const sentInHour = await this.prisma.emailLoginChallenge.count({
            where: { userId: user.id, createdAt: { gt: new Date(now.getTime() - 3600000) } },
        });
        if (sentInHour >= MAX_SEND_IN_HOUR || attempt >= MAX_SEND_IN_HOUR) {
            await this.prisma.user.update({
                where: { id: user.id },
                data: { lockedUntil: new Date(now.getTime() + 3600000), loginAttemptCount: 0, lastLoginAttemptAt: now },
            });
            this.tooMany("Bạn đã thử quá nhiều lần, tài khoản bị khoá 1 giờ.");
        }
        const ch = await this.prisma.emailLoginChallenge.create({
            data: {
                userId: user.id,
                codeHash: "",
                expiresAt: new Date(now.getTime() + CHALLENGE_TTL_MIN * 60 * 1000),
                ip,
                userAgent: ua,
                nextPath: next || "/",
                lastSentAt: new Date(now.getTime() - RESEND_COOLDOWN_SEC * 1000),
            },
            select: { id: true },
        });
        await this.prisma.user.update({
            where: { id: user.id },
            data: { loginAttemptCount: attempt + 1, lastLoginAttemptAt: now },
        });
        return { verifyRequired: true, challengeId: ch.id, resendAfterSec: 0 };
    }
    async loginVerifyResend(challengeId) {
        const now = new Date();
        const ch = await this.prisma.emailLoginChallenge.findUnique({
            where: { id: challengeId },
            include: { user: { select: { id: true, email: true } } },
        });
        if (!ch)
            throw new common_1.BadRequestException("Challenge không hợp lệ");
        if (ch.usedAt || ch.expiresAt < now)
            throw new common_1.BadRequestException("Challenge đã hết hạn");
        const since = (now.getTime() - new Date(ch.lastSentAt).getTime()) / 1000;
        if (since < RESEND_COOLDOWN_SEC)
            this.tooMany(`Vui lòng đợi ${Math.ceil(RESEND_COOLDOWN_SEC - since)}s để gửi lại.`);
        const sentInHour = await this.prisma.emailLoginChallenge.count({
            where: { userId: ch.userId, lastSentAt: { gt: new Date(now.getTime() - 3600000) } },
        });
        if (sentInHour >= MAX_SEND_IN_HOUR) {
            await this.prisma.user.update({
                where: { id: ch.userId },
                data: { lockedUntil: new Date(now.getTime() + 3600000), loginAttemptCount: 0, lastLoginAttemptAt: now },
            });
            this.tooMany("Bạn đã thử quá nhiều lần, tài khoản bị khoá 1 giờ.");
        }
        const code = (Math.floor(100000 + Math.random() * 900000)).toString();
        const codeHash = await bcrypt.hash(code, 10);
        await this.mailer.sendOtp(ch.user.email, code);
        await this.prisma.emailLoginChallenge.update({
            where: { id: ch.id },
            data: { codeHash, sentCount: { increment: 1 }, lastSentAt: now },
        });
        return { ok: true, resendAfterSec: RESEND_COOLDOWN_SEC };
    }
    async loginVerifyVerify(challengeId, code, res) {
        var _a, _b;
        const now = new Date();
        const ch = await this.prisma.emailLoginChallenge.findUnique({
            where: { id: challengeId },
            include: {
                user: { select: { id: true, email: true, role: true, sessionVersion: true } },
            },
        });
        if (!ch)
            throw new common_1.BadRequestException("Challenge không hợp lệ");
        if (ch.usedAt || ch.expiresAt < now)
            throw new common_1.BadRequestException("Mã đã hết hạn hoặc challenge không hợp lệ");
        if (((_a = ch.verifyCount) !== null && _a !== void 0 ? _a : 0) >= 5) {
            await this.prisma.user.update({
                where: { id: ch.userId },
                data: { lockedUntil: new Date(now.getTime() + 3600000) },
            });
            this.tooMany("Bạn nhập sai quá nhiều lần. Tài khoản bị khoá 1 giờ.");
        }
        const ok = await bcrypt.compare(String(code || ""), ch.codeHash || "");
        if (!ok) {
            await this.prisma.emailLoginChallenge.update({
                where: { id: ch.id },
                data: { verifyCount: { increment: 1 } },
            });
            throw new common_1.BadRequestException("Mã xác minh không đúng.");
        }
        await this.prisma.emailLoginChallenge.update({
            where: { id: ch.id },
            data: { usedAt: new Date() },
        });
        const sv = (_b = ch.user.sessionVersion) !== null && _b !== void 0 ? _b : 0;
        const accessToken = await this.signAccessToken({
            sub: ch.user.id, email: ch.user.email, role: ch.user.role, sv,
        });
        const refreshToken = await this.signRefreshToken({ sub: ch.user.id, sv });
        this.setAuthCookies(res, accessToken, refreshToken);
        return ch.nextPath || "/";
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        mailer_service_1.MailerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map