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
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const article_entity_1 = require("./article.entity");
const CONCURRENCY = Number(process.env.BULK_CONCURRENCY || 3);
let ArticlesService = class ArticlesService {
    constructor(repo) {
        this.repo = repo;
    }
    async create(dto) {
        const publishedAt = dto.publishedAt ? new Date(dto.publishedAt) : null;
        if (publishedAt && isNaN(+publishedAt)) {
            throw new common_1.BadRequestException('publishedAt phải là ISO 8601');
        }
        try {
            const entity = this.repo.create({ ...dto, publishedAt });
            return await this.repo.save(entity);
        }
        catch (e) {
            if (e?.code === 'ER_DUP_ENTRY') {
                throw new common_1.BadRequestException('Slug đã tồn tại');
            }
            throw e;
        }
    }
    async findAll(params) {
        const page = Math.max(1, params.page ?? 1);
        const limit = Math.min(100, Math.max(1, params.limit ?? 10));
        const skip = (page - 1) * limit;
        const q = (params.q ?? '').trim();
        const where = q
            ? [
                { title: (0, typeorm_2.Like)(`%${q}%`) },
                { excerpt: (0, typeorm_2.Like)(`%${q}%`) },
                { content: (0, typeorm_2.Like)(`%${q}%`) },
                { author: (0, typeorm_2.Like)(`%${q}%`) },
            ]
            : undefined;
        const [items, total] = await this.repo.findAndCount({
            where,
            order: { publishedAt: 'DESC', createdAt: 'DESC' },
            skip,
            take: limit,
            select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                author: true,
                image: true,
                publishedAt: true,
            },
        });
        const pages = Math.max(1, Math.ceil(total / limit));
        return {
            items,
            meta: {
                page,
                limit,
                total,
                pages,
                hasPrev: page > 1,
                hasNext: page < pages,
            },
        };
    }
    async findBySlug(slug) {
        const article = await this.repo.findOne({ where: { slug } });
        if (!article)
            throw new common_1.NotFoundException('Article not found');
        return article;
    }
    async update(id, dto) {
        let publishedAt;
        if (dto.publishedAt != null) {
            const iso = toISOFromVNOrISO(String(dto.publishedAt));
            const d = new Date(iso);
            if (Number.isNaN(+d)) {
                throw new common_1.BadRequestException('publishedAt phải là ISO 8601 hoặc "dd/MM/yyyy HH:mm SA|CH"');
            }
            publishedAt = d;
        }
        try {
            await this.repo.update({ id }, {
                title: dto.title,
                slug: dto.slug,
                excerpt: dto.excerpt,
                content: dto.content,
                author: dto.author,
                image: dto.image,
                ...(dto.publishedAt != null ? { publishedAt } : {}),
            });
            const updated = await this.repo.findOne({ where: { id } });
            if (!updated)
                throw new common_1.NotFoundException('Article not found');
            return updated;
        }
        catch (e) {
            if (e?.code === 'ER_DUP_ENTRY')
                throw new common_1.BadRequestException('Slug đã tồn tại');
            throw e;
        }
    }
    async remove(id) {
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new common_1.NotFoundException('Article not found');
        return { ok: true };
    }
    async bulkInsert(items) {
        if (!Array.isArray(items) || items.length === 0) {
            throw new common_1.BadRequestException('items rỗng');
        }
        const normalized = items.map((it, idx) => {
            const publishedAt = it.publishedAt ? new Date(it.publishedAt) : null;
            if (publishedAt && isNaN(+publishedAt)) {
                throw new common_1.BadRequestException(`publishedAt không hợp lệ tại index ${idx}`);
            }
            return { ...it, publishedAt };
        });
        const results = await this.runPool(normalized, CONCURRENCY, async (dto) => {
            try {
                const slug = await this.ensureUniqueSlug((dto.slug || '').trim());
                const ent = this.repo.create({ ...dto, slug });
                await this.repo.insert(ent);
                return { ok: true, slug };
            }
            catch (e) {
                if (e?.code === 'ER_DUP_ENTRY') {
                    return { ok: false, error: 'Slug đã tồn tại' };
                }
                return { ok: false, error: e?.message || 'insert-failed' };
            }
        });
        const ok = results.filter((r) => r.ok).length;
        return { ok, fail: results.length - ok, results };
    }
    async ensureUniqueSlug(base) {
        let slug = (base || '').toLowerCase().trim();
        if (!slug)
            slug = 'bai-viet';
        let i = 0;
        while (i < 50) {
            const s = i === 0 ? slug : `${slug}-${i}`;
            const exists = await this.repo.exist({ where: { slug: s } });
            if (!exists)
                return s;
            i++;
        }
        return `${slug}-${Date.now()}`;
    }
    async runPool(items, limit, worker) {
        const ret = new Array(items.length);
        let i = 0;
        const n = Math.max(1, Math.min(limit, items.length));
        const lanes = [];
        for (let lane = 0; lane < n; lane++) {
            lanes.push((async () => {
                while (true) {
                    const idx = i++;
                    if (idx >= items.length)
                        break;
                    ret[idx] = await worker(items[idx], idx);
                }
            })());
        }
        await Promise.all(lanes);
        return ret;
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(article_entity_1.Article)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
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