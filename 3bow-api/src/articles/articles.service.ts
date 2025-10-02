// //src/articles/articles.service.ts
// import {
//   BadRequestException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Like, Repository } from 'typeorm'; // ✅ MySQL dùng Like
// import { CreateArticleDto } from './dto/create-article.dto';
// import { UpdateArticleDto } from './dto/update-article.dto';
// import { ListArticlesDto } from './dto/list-articles.dto';
// import { Article } from './article.entity';

// @Injectable()
// export class ArticlesService {
//   constructor(@InjectRepository(Article) private repo: Repository<Article>) {}

//   async create(dto: CreateArticleDto) {
//     const publishedAt = dto.publishedAt ? new Date(dto.publishedAt) : null;
//     if (publishedAt && isNaN(+publishedAt)) {
//       throw new BadRequestException('publishedAt phải là ISO 8601');
//     }

//     try {
//       const entity = this.repo.create({ ...dto, publishedAt });
//       return await this.repo.save(entity);
//     } catch (e: any) {
//       if (e?.code === 'ER_DUP_ENTRY') {
//         throw new BadRequestException('Slug đã tồn tại');
//       }
//       throw e;
//     }
//   }

//   async findAll(params: ListArticlesDto) {
//     const page = Math.max(1, params.page ?? 1);
//     const limit = Math.min(100, Math.max(1, params.limit ?? 10));
//     const skip = (page - 1) * limit;
//     const q = (params.q ?? '').trim();

//     const where = q
//       ? [
//           { title: Like(`%${q}%`) },
//           { excerpt: Like(`%${q}%`) },
//           { content: Like(`%${q}%`) },
//           { author: Like(`%${q}%`) },
//         ]
//       : undefined;

//     const [items, total] = await this.repo.findAndCount({
//       where,
//       order: { publishedAt: 'DESC', createdAt: 'DESC' },
//       skip,
//       take: limit,
//       select: {
//         id: true,
//         slug: true,
//         title: true,
//         excerpt: true,
//         author: true,
//         image: true,
//         publishedAt: true,
//       },
//     });

//     const pages = Math.max(1, Math.ceil(total / limit));
//     return {
//       items,
//       meta: {
//         page,
//         limit,
//         total,
//         pages,
//         hasPrev: page > 1,
//         hasNext: page < pages,
//       },
//     };
//   }

//   async findBySlug(slug: string) {
//     const article = await this.repo.findOne({ where: { slug } });
//     if (!article) throw new NotFoundException('Article not found');
//     return article;
//   }

//   async update(id: string, dto: UpdateArticleDto) {
//     let publishedAt: Date | undefined;
//     if (dto.publishedAt != null) {
//       const iso = toISOFromVNOrISO(String(dto.publishedAt));
//       const d = new Date(iso);
//       if (Number.isNaN(+d)) {
//         throw new BadRequestException(
//           'publishedAt phải là ISO 8601 hoặc "dd/MM/yyyy HH:mm SA|CH"',
//         );
//       }
//       publishedAt = d;
//     }

//     try {
//       await this.repo.update(
//         { id },
//         {
//           title: dto.title,
//           slug: dto.slug,
//           excerpt: dto.excerpt,
//           content: dto.content,
//           author: dto.author,
//           image: dto.image,
//           ...(dto.publishedAt != null ? { publishedAt } : {}),
//         },
//       );
//       const updated = await this.repo.findOne({ where: { id } });
//       if (!updated) throw new NotFoundException('Article not found');
//       return updated;
//     } catch (e: any) {
//       if (e?.code === 'ER_DUP_ENTRY')
//         throw new BadRequestException('Slug đã tồn tại');
//       throw e;
//     }
//   }

//   async remove(id: string) {
//     const res = await this.repo.delete({ id });
//     if (!res.affected) throw new NotFoundException('Article not found');
//     return { ok: true };
//   }
// }

// function toISOFromVNOrISO(s: string) {
//   const m = s.trim().match(
//     /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})\s*(SA|CH)$/i,
//   );
//   if (!m) return s; // không match → coi như ISO
//   let [, dd, mm, yyyy, hh, min, ampm] = m;
//   let H = parseInt(hh, 10);
//   if (/CH/i.test(ampm) && H < 12) H += 12; // CH = PM
//   if (/SA/i.test(ampm) && H === 12) H = 0; // SA = AM (12 giờ => 0)
//   const d = new Date(+yyyy, +mm - 1, +dd, H, +min);
//   return d.toISOString();
// }

















import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ListArticlesDto } from './dto/list-articles.dto';
import { Article } from './article.entity';

const CONCURRENCY = Number(process.env.BULK_CONCURRENCY || 3); // giới hạn luồng

@Injectable()
export class ArticlesService {
  constructor(@InjectRepository(Article) private repo: Repository<Article>) {}

  // ---------- CRUD đơn ----------
  async create(dto: CreateArticleDto) {
    const publishedAt = dto.publishedAt ? new Date(dto.publishedAt) : null;
    if (publishedAt && isNaN(+publishedAt)) {
      throw new BadRequestException('publishedAt phải là ISO 8601');
    }
    try {
      const entity = this.repo.create({ ...dto, publishedAt });
      return await this.repo.save(entity);
    } catch (e: any) {
      if (e?.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Slug đã tồn tại');
      }
      throw e;
    }
  }

  async findAll(params: ListArticlesDto) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 10));
    const skip = (page - 1) * limit;
    const q = (params.q ?? '').trim();

    const where = q
      ? [
          { title: Like(`%${q}%`) },
          { excerpt: Like(`%${q}%`) },
          { content: Like(`%${q}%`) },
          { author: Like(`%${q}%`) },
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

  async findBySlug(slug: string) {
    const article = await this.repo.findOne({ where: { slug } });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async update(id: string, dto: UpdateArticleDto) {
    let publishedAt: Date | undefined;
    if (dto.publishedAt != null) {
      const iso = toISOFromVNOrISO(String(dto.publishedAt));
      const d = new Date(iso);
      if (Number.isNaN(+d)) {
        throw new BadRequestException(
          'publishedAt phải là ISO 8601 hoặc "dd/MM/yyyy HH:mm SA|CH"',
        );
      }
      publishedAt = d;
    }

    try {
      await this.repo.update(
        { id },
        {
          title: dto.title,
          slug: dto.slug,
          excerpt: dto.excerpt,
          content: dto.content,
          author: dto.author,
          image: dto.image,
          ...(dto.publishedAt != null ? { publishedAt } : {}),
        },
      );
      const updated = await this.repo.findOne({ where: { id } });
      if (!updated) throw new NotFoundException('Article not found');
      return updated;
    } catch (e: any) {
      if (e?.code === 'ER_DUP_ENTRY')
        throw new BadRequestException('Slug đã tồn tại');
      throw e;
    }
  }

  async remove(id: string) {
    const res = await this.repo.delete({ id });
    if (!res.affected) throw new NotFoundException('Article not found');
    return { ok: true };
  }

  // ---------- BULK INSERT (NHANH) ----------
  async bulkInsert(items: CreateArticleDto[]) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('items rỗng');
    }

    // chuẩn hoá + valid trước
    const normalized = items.map((it, idx) => {
      const publishedAt = it.publishedAt ? new Date(it.publishedAt) : null;
      if (publishedAt && isNaN(+publishedAt)) {
        throw new BadRequestException(`publishedAt không hợp lệ tại index ${idx}`);
      }
      return { ...it, publishedAt };
    });

    // pool đồng thời có giới hạn
    const results = await this.runPool(normalized, CONCURRENCY, async (dto) => {
      try {
        const slug = await this.ensureUniqueSlug((dto.slug || '').trim());
        const ent = this.repo.create({ ...dto, slug });
        await this.repo.insert(ent); // nhanh hơn save
        return { ok: true, slug };
      } catch (e: any) {
        if (e?.code === 'ER_DUP_ENTRY') {
          return { ok: false, error: 'Slug đã tồn tại' };
        }
        return { ok: false, error: e?.message || 'insert-failed' };
      }
    });

    const ok = results.filter((r) => r.ok).length;
    return { ok, fail: results.length - ok, results };
  }

  // ----- helpers -----
  private async ensureUniqueSlug(base: string) {
    let slug = (base || '').toLowerCase().trim();
    if (!slug) slug = 'bai-viet';
    let i = 0;
    // vòng lặp ngắn; rely vào UNIQUE(slug) để đảm bảo cuối cùng không trùng
    while (i < 50) {
      const s = i === 0 ? slug : `${slug}-${i}`;
      const exists = await this.repo.exist({ where: { slug: s } });
      if (!exists) return s;
      i++;
    }
    // fallback: dùng timestamp để đảm bảo unique
    return `${slug}-${Date.now()}`;
  }

  private async runPool<T, R>(
    items: T[],
    limit: number,
    worker: (item: T, idx: number) => Promise<R>,
  ): Promise<R[]> {
    const ret: R[] = new Array(items.length);
    let i = 0;
    const n = Math.max(1, Math.min(limit, items.length));
    const lanes: Promise<void>[] = [];
    for (let lane = 0; lane < n; lane++) {
      lanes.push(
        (async () => {
          while (true) {
            const idx = i++;
            if (idx >= items.length) break;
            ret[idx] = await worker(items[idx], idx);
          }
        })(),
      );
    }
    await Promise.all(lanes);
    return ret;
  }
}

function toISOFromVNOrISO(s: string) {
  const m = s.trim().match(
    /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})\s*(SA|CH)$/i,
  );
  if (!m) return s;
  let [, dd, mm, yyyy, hh, min, ampm] = m;
  let H = parseInt(hh, 10);
  if (/CH/i.test(ampm) && H < 12) H += 12;
  if (/SA/i.test(ampm) && H === 12) H = 0;
  const d = new Date(+yyyy, +mm - 1, +dd, H, +min);
  return d.toISOString();
}
