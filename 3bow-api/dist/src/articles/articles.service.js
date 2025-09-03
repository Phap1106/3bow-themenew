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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
        const limit = Math.min(100, Math.max(1, (_b = params.limit) !== null && _b !== void 0 ? _b : 12));
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
        try {
            const _a = dto, { publishedAt } = _a, rest = __rest(_a, ["publishedAt"]);
            return await this.prisma.article.update({
                where: { id },
                data: Object.assign(Object.assign({}, rest), { publishedAt: publishedAt ? new Date(publishedAt) : undefined }),
            });
        }
        catch (_b) {
            throw new common_1.NotFoundException("Article not found");
        }
    }
    async remove(id) {
        try {
            await this.prisma.article.delete({ where: { id } });
            return { ok: true };
        }
        catch (_a) {
            throw new common_1.NotFoundException("Article not found");
        }
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map