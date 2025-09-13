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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findSupport(params) {
        var _a, _b, _c;
        const page = Math.max(1, (_a = params.page) !== null && _a !== void 0 ? _a : 1);
        const limit = Math.min(100, Math.max(1, (_b = params.limit) !== null && _b !== void 0 ? _b : 10));
        const q = ((_c = params.q) !== null && _c !== void 0 ? _c : "").trim();
        const where = Object.assign({ role: client_1.UserRole.SUPPORT_ADMIN }, (q
            ? {
                OR: [
                    { email: { contains: q, mode: "insensitive" } },
                    { firstName: { contains: q, mode: "insensitive" } },
                    { lastName: { contains: q, mode: "insensitive" } },
                    { phone: { contains: q, mode: "insensitive" } },
                ],
            }
            : {}));
        const [items, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    role: true,
                    createdAt: true,
                },
            }),
            this.prisma.user.count({ where }),
        ]);
        return { items, total, page, limit };
    }
    listSupportAdmins(q = "", page = 1, limit = 20) {
        return this.findSupport({ q, page, limit });
    }
    async updateSupportAdmin(id, dto) {
        var _a, _b, _c;
        const u = await this.prisma.user.findUnique({
            where: { id },
            select: { id: true, role: true },
        });
        if (!u)
            throw new common_1.NotFoundException("User không tồn tại");
        if (u.role !== client_1.UserRole.SUPPORT_ADMIN)
            throw new common_1.BadRequestException("Chỉ cập nhật Support Admin");
        const data = {
            firstName: (_a = dto.firstName) !== null && _a !== void 0 ? _a : undefined,
            lastName: (_b = dto.lastName) !== null && _b !== void 0 ? _b : undefined,
            phone: (_c = dto.phone) !== null && _c !== void 0 ? _c : undefined,
        };
        if (dto.password && dto.password.length >= 6) {
            data.password = await bcrypt.hash(dto.password, 10);
            data.sessionVersion = { increment: 1 };
        }
        return this.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                role: true,
                firstName: true,
                lastName: true,
                phone: true,
                createdAt: true,
            },
        });
    }
    async kick(id) {
        return this.prisma.user.update({
            where: { id },
            data: { sessionVersion: { increment: 1 } },
            select: { id: true },
        });
    }
    async delete(id) {
        await this.prisma.user
            .update({
            where: { id },
            data: { sessionVersion: { increment: 1 } },
        })
            .catch(() => { });
        return this.prisma.user.delete({ where: { id } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map