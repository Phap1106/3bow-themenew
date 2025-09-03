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
let AuthService = class AuthService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async signAccessToken(payload) {
        return this.jwt.signAsync(payload, {
            secret: process.env.JWT_SECRET || "dev_secret",
            expiresIn: "7d",
        });
    }
    async signRefreshToken(userId) {
        return this.jwt.signAsync({ sub: userId, typ: "refresh" }, {
            secret: process.env.JWT_REFRESH_SECRET ||
                process.env.JWT_SECRET ||
                "dev_secret",
            expiresIn: "30d",
        });
    }
    async registerSupportAdmin(dto) {
        var _a, _b, _c, _d;
        const exists = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: { id: true },
        });
        if (exists)
            throw new common_1.BadRequestException("Email đã tồn tại");
        const hash = await bcrypt.hash(dto.password, 10);
        const u = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hash,
                firstName: ((_a = dto.firstName) === null || _a === void 0 ? void 0 : _a.trim()) || "",
                lastName: ((_b = dto.lastName) === null || _b === void 0 ? void 0 : _b.trim()) || "",
                phone: ((_c = dto.phone) === null || _c === void 0 ? void 0 : _c.trim()) || null,
                address: ((_d = dto.address) === null || _d === void 0 ? void 0 : _d.trim()) || null,
                role: "SUPPORT_ADMIN",
            },
            select: {
                id: true,
                email: true,
                role: true,
                firstName: true,
                lastName: true,
                phone: true,
                address: true,
            },
        });
        return u;
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user)
            throw new common_1.UnauthorizedException("Email hoặc mật khẩu không đúng");
        const ok = await bcrypt.compare(dto.password, user.password);
        if (!ok)
            throw new common_1.UnauthorizedException("Email hoặc mật khẩu không đúng");
        const accessToken = await this.signAccessToken({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = await this.signRefreshToken(user.id);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                address: user.address,
            },
        };
    }
    async adminUpdateSupport(id, dto) {
        var _a, _b, _c, _d;
        const target = await this.prisma.user.findUnique({
            where: { id },
            select: { id: true, role: true, email: true },
        });
        if (!target)
            throw new common_1.NotFoundException("Không tìm thấy user");
        if (target.role !== "SUPPORT_ADMIN")
            throw new common_1.BadRequestException("Chỉ sửa được tài khoản Support Admin");
        const updated = await this.prisma.user.update({
            where: { id },
            data: {
                firstName: (_a = dto.firstName) !== null && _a !== void 0 ? _a : undefined,
                lastName: (_b = dto.lastName) !== null && _b !== void 0 ? _b : undefined,
                phone: (_c = dto.phone) !== null && _c !== void 0 ? _c : undefined,
                address: (_d = dto.address) !== null && _d !== void 0 ? _d : undefined,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                address: true,
                role: true,
            },
        });
        return updated;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map