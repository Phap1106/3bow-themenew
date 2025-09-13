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
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ArticlesService = class ArticlesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const publishedAt = dto.publishedAt ? new Date(dto.publishedAt) : null;
        if (publishedAt && isNaN(+publishedAt)) {
            throw new common_1.BadRequestException("publishedAt phải là ISO 8601");
        }
        try {
            return await this.prisma.article.create({
                data: Object.assign(Object.assign({}, dto), { publishedAt }),
            });
        }
        catch (e) {
            if ((e === null || e === void 0 ? void 0 : e.code) === "P2002")
                throw new common_1.BadRequestException("Slug đã tồn tại");
            throw e;
        }
    }
    async findAll(params) {
        var _a, _b, _c;
        const page = Math.max(1, (_a = params.page) !== null && _a !== void 0 ? _a : 1);
        const limit = Math.min(100, Math.max(1, (_b = params.limit) !== null && _b !== void 0 ? _b : 10));
        const skip = (page - 1) * limit;
        const q = ((_c = params.q) !== null && _c !== void 0 ? _c : "").trim();
        const where = q
            ? {
                OR: [
                    { title: { contains: q, mode: "insensitive" } },
                    { excerpt: { contains: q, mode: "insensitive" } },
                    { content: { contains: q, mode: "insensitive" } },
                    { author: { contains: q, mode: "insensitive" } },
                ],
            }
            : {};
        const [items, total] = await this.prisma.$transaction([
            this.prisma.article.findMany({
                where,
                orderBy: [
                    { publishedAt: "desc" },
                    { createdAt: "desc" },
                ],
                skip,
                take: limit,
                select: {
                    id: true, slug: true, title: true, excerpt: true,
                    author: true, image: true, publishedAt: true,
                },
            }),
            this.prisma.article.count({ where }),
        ]);
        const pages = Math.max(1, Math.ceil(total / limit));
        const hasPrev = page > 1;
        const hasNext = page < pages;
        return {
            items,
            meta: { page, limit, total, pages, hasPrev, hasNext },
        };
    }
    async findBySlug(slug) {
        const article = await this.prisma.article.findUnique({ where: { slug } });
        if (!article)
            throw new common_1.NotFoundException("Article not found");
        return article;
    }
    async update(id, dto) {
        let publishedAt = undefined;
        if (dto.publishedAt != null) {
            const iso = toISOFromVNOrISO(String(dto.publishedAt));
            const d = new Date(iso);
            if (Number.isNaN(+d)) {
                throw new common_1.BadRequestException('publishedAt phải là ISO 8601 hoặc "dd/MM/yyyy HH:mm SA|CH"');
            }
            publishedAt = d;
        }
        try {
            const updated = await this.prisma.article.update({
                where: { id },
                data: Object.assign({ title: dto.title, slug: dto.slug, excerpt: dto.excerpt, content: dto.content, author: dto.author, image: dto.image }, (dto.publishedAt != null ? { publishedAt } : {})),
            });
            return updated;
        }
        catch (e) {
            if ((e === null || e === void 0 ? void 0 : e.code) === 'P2002')
                throw new common_1.BadRequestException('Slug đã tồn tại');
            if ((e === null || e === void 0 ? void 0 : e.code) === 'P2025')
                throw new common_1.NotFoundException('Article not found');
            throw e;
        }
    }
    async remove(id) {
        try {
            await this.prisma.article.delete({ where: { id } });
            return { ok: true };
        }
        catch (e) {
            if ((e === null || e === void 0 ? void 0 : e.code) === 'P2025')
                throw new common_1.NotFoundException('Article not found');
            throw e;
        }
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArticlesService);
function toISOFromVNOrISO(s) {
    const m = s.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})\s*(SA|CH)$/i);
    if (!m)
        return s;
    let [, dd, mm, yyyy, hh, min, ampm] = m;
    let H = parseInt(hh, 10);
    if (/CH/i.test(ampm) && H < 12)
        H += 12;
    if (/SA/i.test(ampm) && H === 12)
        H = 0;
    const d = new Date(+yyyy, +mm - 1, +dd, H, +min);
    return d.toISOString();
}
//# sourceMappingURL=articles.service.js.map