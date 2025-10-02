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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const user_entity_1 = require("./user.entity");
const enums_1 = require("../common/enums");
let UsersService = class UsersService {
    constructor(repo) {
        this.repo = repo;
    }
    async findSupport(params) {
        const page = Math.max(1, params.page ?? 1);
        const limit = Math.min(100, Math.max(1, params.limit ?? 10));
        const q = (params.q ?? '').trim();
        const where = { role: enums_1.UserRole.SUPPORT_ADMIN };
        if (q) {
            where['email'] = (0, typeorm_2.ILike)(`%${q}%`);
            const wheres = [
                { role: enums_1.UserRole.SUPPORT_ADMIN, email: (0, typeorm_2.ILike)(`%${q}%`) },
                { role: enums_1.UserRole.SUPPORT_ADMIN, firstName: (0, typeorm_2.ILike)(`%${q}%`) },
                { role: enums_1.UserRole.SUPPORT_ADMIN, lastName: (0, typeorm_2.ILike)(`%${q}%`) },
                { role: enums_1.UserRole.SUPPORT_ADMIN, phone: (0, typeorm_2.ILike)(`%${q}%`) },
            ];
            const [items, total] = await this.repo.findAndCount({
                where: wheres,
                order: { createdAt: 'DESC' },
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    address: true,
                    img: true,
                    role: true,
                    session: true,
                    createdAt: true,
                    passwordHash: false,
                    sessionVersion: false,
                    updatedAt: false,
                },
            });
            return { items, total, page, limit };
        }
        const [items, total] = await this.repo.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                address: true,
                img: true,
                role: true,
                session: true,
                createdAt: true,
                passwordHash: false,
                sessionVersion: false,
                updatedAt: false,
            },
        });
        return { items, total, page, limit };
    }
    listSupportAdmins(q = '', page = 1, limit = 20) {
        return this.findSupport({ q, page, limit });
    }
    async updateSupportAdmin(id, dto) {
        const u = await this.repo.findOne({
            where: { id },
            select: { id: true, role: true, sessionVersion: true },
        });
        if (!u)
            throw new common_1.NotFoundException('User không tồn tại');
        if (u.role !== enums_1.UserRole.SUPPORT_ADMIN)
            throw new common_1.BadRequestException('Chỉ cập nhật Support Admin');
        const data = {
            firstName: dto.firstName ?? undefined,
            lastName: dto.lastName ?? undefined,
            phone: dto.phone ?? undefined,
            address: dto.address ?? undefined,
            img: dto.img ?? undefined,
        };
        if (dto.password && dto.password.length >= 6) {
            data.passwordHash = await bcrypt.hash(dto.password, 10);
            data.sessionVersion = (u.sessionVersion || 0) + 1;
        }
        await this.repo.update({ id }, data);
        const updated = await this.repo.findOne({
            where: { id },
            select: {
                id: true,
                email: true,
                role: true,
                firstName: true,
                lastName: true,
                phone: true,
                address: true,
                img: true,
                createdAt: true,
            },
        });
        return updated;
    }
    async kick(id) {
        const u = await this.repo.findOne({
            where: { id },
            select: { sessionVersion: true },
        });
        if (!u)
            throw new common_1.NotFoundException('User không tồn tại');
        await this.repo.update({ id }, {
            sessionVersion: (u.sessionVersion || 0) + 1,
            session: null,
        });
        return { id };
    }
    async delete(id) {
        try {
            await this.kick(id);
        }
        catch { }
        await this.repo.delete({ id });
        return { ok: true };
    }
    async getProfile(userId) {
        const user = await this.repo.findOne({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                address: true,
                img: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User không tồn tại');
        return user;
    }
    async updateProfile(userId, dto, requesterId) {
        const user = await this.repo.findOne({
            where: { id: userId },
            select: { id: true, role: true, sessionVersion: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User không tồn tại');
        if (requesterId && requesterId !== userId) {
            const requester = await this.repo.findOne({
                where: { id: requesterId },
                select: { role: true },
            });
            if (!requester || requester.role !== enums_1.UserRole.ADMIN) {
                throw new common_1.ForbiddenException('Không có quyền sửa profile này');
            }
        }
        const data = {};
        if (dto.firstName !== undefined)
            data.firstName = dto.firstName;
        if (dto.lastName !== undefined)
            data.lastName = dto.lastName;
        if (dto.phone !== undefined)
            data.phone = dto.phone;
        if (dto.address !== undefined)
            data.address = dto.address;
        if (dto.img !== undefined)
            data.img = dto.img;
        if (dto.password && dto.password.length >= 6) {
            data.passwordHash = await bcrypt.hash(dto.password, 10);
            data.sessionVersion = (user.sessionVersion || 0) + 1;
        }
        await this.repo.update({ id: userId }, data);
        return this.getProfile(userId);
    }
    async deleteProfile(userId, requesterId) {
        const user = await this.repo.findOne({
            where: { id: userId },
            select: { id: true, role: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User không tồn tại');
        if (requesterId && requesterId !== userId) {
            const requester = await this.repo.findOne({
                where: { id: requesterId },
                select: { role: true },
            });
            if (!requester || requester.role !== enums_1.UserRole.ADMIN) {
                throw new common_1.ForbiddenException('Không có quyền xóa profile này');
            }
        }
        return this.delete(userId);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map