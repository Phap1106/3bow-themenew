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
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const session_entity_1 = require("./session.entity");
const user_entity_1 = require("../users/user.entity");
const crypto = __importStar(require("crypto"));
let SessionService = class SessionService {
    constructor(sessionRepo, userRepo) {
        this.sessionRepo = sessionRepo;
        this.userRepo = userRepo;
    }
    parseUserAgent(userAgent) {
        if (!userAgent)
            return {};
        const ua = userAgent.toLowerCase();
        let deviceType = 'desktop';
        if (/mobile|android|iphone|ipad|phone/i.test(ua))
            deviceType = 'mobile';
        else if (/tablet|ipad/i.test(ua))
            deviceType = 'tablet';
        let browser = 'unknown';
        if (ua.includes('chrome'))
            browser = 'Chrome';
        else if (ua.includes('firefox'))
            browser = 'Firefox';
        else if (ua.includes('safari'))
            browser = 'Safari';
        else if (ua.includes('edge'))
            browser = 'Edge';
        let os = 'unknown';
        if (ua.includes('windows'))
            os = 'Windows';
        else if (ua.includes('mac'))
            os = 'macOS';
        else if (ua.includes('linux'))
            os = 'Linux';
        else if (ua.includes('android'))
            os = 'Android';
        else if (ua.includes('ios'))
            os = 'iOS';
        return { deviceType, browser, os };
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    async createSession(userId, accessToken, refreshToken, ipAddress, userAgent) {
        const { deviceType, browser, os } = this.parseUserAgent(userAgent);
        const accessTokenHash = this.hashToken(accessToken);
        const refreshTokenHash = this.hashToken(refreshToken);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        const session = this.sessionRepo.create({
            userId,
            accessToken: accessTokenHash,
            refreshToken: refreshTokenHash,
            ipAddress,
            userAgent,
            deviceType,
            browser,
            os,
            expiresAt,
            lastActivityAt: new Date(),
            isActive: true,
            status: 'active',
        });
        const savedSession = await this.sessionRepo.save(session);
        await this.updateUserLoginInfo(userId, ipAddress);
        return savedSession;
    }
    async updateUserLoginInfo(userId, ipAddress) {
        const activeCount = await this.sessionRepo.count({
            where: { userId, isActive: true, status: 'active' },
        });
        await this.userRepo.update({ id: userId }, {
            lastLoginAt: new Date(),
            lastLoginIp: ipAddress,
            activeSessionCount: activeCount,
        });
    }
    async updateActivity(accessToken) {
        const tokenHash = this.hashToken(accessToken);
        await this.sessionRepo.update({ accessToken: tokenHash, isActive: true }, { lastActivityAt: new Date() });
    }
    async getUserSessions(userId) {
        return this.sessionRepo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: 50,
        });
    }
    async getActiveSessions(userId) {
        return this.sessionRepo.find({
            where: { userId, isActive: true, status: 'active' },
            order: { lastActivityAt: 'DESC' },
        });
    }
    async revokeSession(accessToken) {
        const tokenHash = this.hashToken(accessToken);
        await this.sessionRepo.update({ accessToken: tokenHash }, {
            isActive: false,
            status: 'logout',
            updatedAt: new Date(),
        });
    }
    async revokeAllUserSessions(userId) {
        const result = await this.sessionRepo.update({ userId, isActive: true }, {
            isActive: false,
            status: 'revoked',
            updatedAt: new Date(),
        });
        await this.userRepo.update({ id: userId }, { activeSessionCount: 0 });
        return result.affected || 0;
    }
    async cleanupExpiredSessions() {
        const result = await this.sessionRepo.update({
            expiresAt: (0, typeorm_2.LessThan)(new Date()),
            isActive: true,
        }, {
            isActive: false,
            status: 'expired',
            updatedAt: new Date(),
        });
        return result.affected || 0;
    }
    async getSessionStats(userId) {
        const baseWhere = userId ? { userId } : {};
        const [totalSessions, activeSessions, todaySessions,] = await Promise.all([
            this.sessionRepo.count({ where: baseWhere }),
            this.sessionRepo.count({
                where: { ...baseWhere, isActive: true, status: 'active' }
            }),
            this.sessionRepo.count({
                where: {
                    ...baseWhere,
                    createdAt: (0, typeorm_2.LessThan)(new Date(Date.now() - 24 * 60 * 60 * 1000)),
                },
            }),
        ]);
        return {
            totalSessions,
            activeSessions,
            todaySessions,
        };
    }
    async validateSession(accessToken) {
        const tokenHash = this.hashToken(accessToken);
        return this.sessionRepo.findOne({
            where: {
                accessToken: tokenHash,
                isActive: true,
                status: 'active',
            },
            relations: ['user'],
        });
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(session_entity_1.UserSession)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SessionService);
//# sourceMappingURL=session.service.js.map