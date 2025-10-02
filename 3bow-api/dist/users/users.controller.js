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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const users_service_1 = require("./users.service");
const update_support_admin_dto_1 = require("./dto/update-support-admin.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    findAllSupport(page, limit, q) {
        const p = Number.isFinite(Number(page)) ? parseInt(page, 10) : 1;
        const l = Number.isFinite(Number(limit)) ? parseInt(limit, 10) : 10;
        return this.usersService.findSupport({ page: p, limit: l, q: q || "" });
    }
    list(q = "", page = "1", limit = "20") {
        return this.usersService.listSupportAdmins(q, Number(page), Number(limit));
    }
    updateSupport(id, dto) {
        return this.usersService.updateSupportAdmin(id, dto);
    }
    remove(id) {
        return this.usersService.delete(id);
    }
    kick(id) {
        return this.usersService.kick(id);
    }
    getMyProfile(req) {
        return this.usersService.getProfile(req.user.id);
    }
    getProfile(id, req) {
        const requesterId = req.user.id;
        if (requesterId !== id && req.user.role !== 'ADMIN') {
            return this.usersService.getProfile(requesterId);
        }
        return this.usersService.getProfile(id);
    }
    updateMyProfile(dto, req) {
        return this.usersService.updateProfile(req.user.id, dto);
    }
    updateProfile(id, dto, req) {
        return this.usersService.updateProfile(id, dto, req.user.id);
    }
    deleteMyProfile(req) {
        return this.usersService.deleteProfile(req.user.id);
    }
    deleteProfile(id, req) {
        return this.usersService.deleteProfile(id, req.user.id);
    }
    async debugImageInfo(req) {
        const user = await this.usersService.getProfile(req.user.id);
        return {
            userId: user.id,
            hasImage: !!user.img,
            imageLength: user.img ? user.img.length : 0,
            isBase64: user.img ? user.img.startsWith('data:image/') : false,
            imagePreview: user.img ? user.img.substring(0, 100) + '...' : null,
            imageType: user.img ? (user.img.match(/data:image\/([^;]+)/) || [])[1] : null
        };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)("support"),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAllSupport", null);
__decorate([
    (0, common_1.Get)("support-admins"),
    __param(0, (0, common_1.Query)("q")),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "list", null);
__decorate([
    (0, common_1.Patch)("support-admins/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_support_admin_dto_1.UpdateSupportAdminDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateSupport", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(":id/kick"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "kick", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)("profile"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)("profile/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Patch)("profile"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_profile_dto_1.UpdateProfileDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateMyProfile", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Patch)("profile/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_profile_dto_1.UpdateProfileDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)("profile"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteMyProfile", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)("profile/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteProfile", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)("debug/image-info"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "debugImageInfo", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map