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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const register_support_admin_dto_1 = require("./dto/register-support-admin.dto");
const login_dto_1 = require("./dto/login.dto");
const update_support_admin_dto_1 = require("../users/dto/update-support-admin.dto");
const roles_decorator_1 = require("./roles.decorator");
const roles_guard_1 = require("./roles.guard");
const enums_1 = require("../common/enums");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    registerSupport(dto) {
        return this.authService.registerSupportAdmin(dto);
    }
    async login(dto, res) {
        const { accessToken, refreshToken, user } = await this.authService.login(dto);
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: isProd,
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: isProd,
            path: '/',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return { ok: true, user };
    }
    async logout(res, req) {
        if (req.user?.id) {
            await this.authService.logout(req.user.id);
        }
        const isProd = process.env.NODE_ENV === 'production';
        const opts = {
            httpOnly: true,
            sameSite: 'lax',
            secure: isProd,
            path: '/',
        };
        res.clearCookie('access_token', opts);
        res.clearCookie('refresh_token', opts);
        res.cookie('access_token', '', { ...opts, maxAge: 0 });
        res.cookie('refresh_token', '', { ...opts, maxAge: 0 });
        return { ok: true };
    }
    async forceLogout(body) {
        try {
            await this.authService.forceLogoutByEmail(body.email);
            return { ok: true, message: 'All sessions cleared successfully' };
        }
        catch (error) {
            return { ok: false, message: 'User not found or already logged out' };
        }
    }
    me(req) {
        const u = req.user;
        return {
            id: u.id,
            email: u.email,
            role: u.role,
            firstName: u.firstName,
            lastName: u.lastName,
            phone: u.phone,
            address: u.address,
        };
    }
    updateSupport(id, dto) {
        return this.authService.adminUpdateSupport(id, dto);
    }
    startLoginVerify(dto, req) {
        return this.authService.loginVerifyStart(dto, dto.next, req.ip, req.headers['user-agent']);
    }
    resendLoginVerify(challengeId) {
        return this.authService.loginVerifyResend(challengeId);
    }
    async verifyLogin(body, res) {
        const next = await this.authService.loginVerifyVerify(body.challengeId, body.code, res);
        return res.json({ ok: true, next });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register-support-admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_support_admin_dto_1.RegisterSupportAdminDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "registerSupport", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('force-logout'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forceLogout", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    (0, common_1.Put)('support-admin/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_support_admin_dto_1.UpdateSupportAdminDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "updateSupport", null);
__decorate([
    (0, common_1.Post)('login-verify/start'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "startLoginVerify", null);
__decorate([
    (0, common_1.Post)('login-verify/resend'),
    __param(0, (0, common_1.Body)('challengeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resendLoginVerify", null);
__decorate([
    (0, common_1.Post)('login-verify/verify'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyLogin", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map