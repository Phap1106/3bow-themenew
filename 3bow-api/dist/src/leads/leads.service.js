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
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let LeadsService = class LeadsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, meta) {
        return this.prisma.lead.create({
            data: Object.assign(Object.assign({}, dto), { ip: meta.ip, userAgent: meta.userAgent }),
        });
    }
    async findAll(q) {
        var _a, _b, _c, _d, _e, _f;
        const where = {};
        if (q.status)
            where.status = q.status;
        const skip = ((_a = q.page) !== null && _a !== void 0 ? _a : 0) * ((_b = q.pageSize) !== null && _b !== void 0 ? _b : 20);
        const take = (_c = q.pageSize) !== null && _c !== void 0 ? _c : 20;
        const [items, total] = await this.prisma.$transaction([
            this.prisma.lead.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take,
            }),
            this.prisma.lead.count({ where }),
        ]);
        return {
            items,
            total,
            page: (_d = q.page) !== null && _d !== void 0 ? _d : 0,
            pageSize: (_e = q.pageSize) !== null && _e !== void 0 ? _e : 20,
            totalPages: Math.ceil(total / ((_f = q.pageSize) !== null && _f !== void 0 ? _f : 20)),
        };
    }
    async findOne(id) {
        return this.prisma.lead.findUnique({ where: { id } });
    }
    async update(id, dto) {
        return this.prisma.lead.update({ where: { id }, data: dto });
    }
    async markSpam(id) {
        return this.prisma.lead.update({
            where: { id },
            data: { status: client_1.LeadStatus.SPAM },
        });
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map