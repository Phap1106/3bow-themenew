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
exports.SupportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
function toBool(v, def = true) {
    if (typeof v === "boolean")
        return v;
    if (typeof v === "string") {
        const s = v.toLowerCase();
        return s === "true" || s === "1" || s === "on" || s === "yes";
    }
    if (typeof v === "number")
        return v !== 0;
    return def;
}
let SupportService = class SupportService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list({ q, page = 1, limit = 20 }) {
        const where = q
            ? { OR: [
                    { name: { contains: q, mode: "insensitive" } },
                    { email: { contains: q, mode: "insensitive" } },
                    { phone: { contains: q, mode: "insensitive" } },
                ] }
            : {};
        const [items, total] = await this.prisma.$transaction([
            this.prisma.support.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" } }),
            this.prisma.support.count({ where }),
        ]);
        return { items, total, page, limit };
    }
    create(dto) {
        var _a, _b, _c, _d, _e, _f, _g;
        const raw = ((_a = dto.role) !== null && _a !== void 0 ? _a : "").toString().toUpperCase();
        const STAFF = client_1.SupportRole.STAFF;
        const AGENT = client_1.SupportRole.AGENT;
        const role = ((_d = (_c = (_b = client_1.SupportRole[raw]) !== null && _b !== void 0 ? _b : STAFF) !== null && _c !== void 0 ? _c : AGENT) !== null && _d !== void 0 ? _d : client_1.SupportRole.ADMIN);
        const active = toBool(dto.active, true);
        return this.prisma.support.create({
            data: {
                name: dto.name.trim(),
                email: ((_e = dto.email) === null || _e === void 0 ? void 0 : _e.trim()) || undefined,
                phone: ((_f = dto.phone) === null || _f === void 0 ? void 0 : _f.trim()) || undefined,
                note: ((_g = dto.note) === null || _g === void 0 ? void 0 : _g.trim()) || undefined,
                role,
                active,
            },
        });
    }
    delete(id) { return this.prisma.support.delete({ where: { id } }); }
    kick(id) { return this.prisma.support.update({ where: { id }, data: { kickedAt: new Date() } }); }
};
exports.SupportService = SupportService;
exports.SupportService = SupportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SupportService);
//# sourceMappingURL=support.service.js.map