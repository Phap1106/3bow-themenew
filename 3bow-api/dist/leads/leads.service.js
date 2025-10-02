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
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const lead_entity_1 = require("./lead.entity");
const enums_1 = require("./enums");
let LeadsService = class LeadsService {
    constructor(repo) {
        this.repo = repo;
    }
    async create(dto, meta) {
        const lead = this.repo.create({
            ...dto,
            ip: meta.ip,
            userAgent: meta.userAgent,
            consent: !!dto.consent,
            status: enums_1.LeadStatus.NEW,
        });
        return this.repo.save(lead);
    }
    async findAll(q) {
        const where = {};
        if (q.status)
            where.status = q.status;
        if (q.q) {
            const kw = q.q.trim();
            where['$or'] = [
                { name: (0, typeorm_1.ILike)(`%${kw}%`) },
                { phone: (0, typeorm_1.ILike)(`%${kw}%`) },
                { email: (0, typeorm_1.ILike)(`%${kw}%`) },
                { url: (0, typeorm_1.ILike)(`%${kw}%`) },
            ];
        }
        const page = q.page ?? 0;
        const pageSize = q.pageSize ?? 20;
        const [items, total] = await this.repo.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: page * pageSize,
            take: pageSize,
        });
        return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
    }
    async findOne(id) {
        const item = await this.repo.findOne({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Lead not found');
        return item;
    }
    async update(id, dto) {
        await this.repo.update({ id }, dto);
        return this.findOne(id);
    }
    async markSpam(id) {
        await this.repo.update({ id }, { status: enums_1.LeadStatus.SPAM });
        return this.findOne(id);
    }
    async remove(id) {
        const r = await this.repo.delete({ id });
        if (!r.affected)
            throw new common_1.NotFoundException('Lead not found');
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(lead_entity_1.Lead)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], LeadsService);
//# sourceMappingURL=leads.service.js.map