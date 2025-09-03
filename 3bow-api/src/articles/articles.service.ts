// //src/articles/articles.service.ts
// import { Injectable, NotFoundException } from "@nestjs/common";
// import { PrismaService } from "../prisma/prisma.service";
// import { CreateArticleDto } from "./dto/create-article.dto";
// import { UpdateArticleDto } from "./dto/update-article.dto";
// import { Prisma } from "@prisma/client";
// import { BadRequestException } from "@nestjs/common";
// @Injectable()
// export class ArticlesService {
//   constructor(private prisma: PrismaService) {}
 
// async create(dto: CreateArticleDto) {
//   const publishedAt = dto.publishedAt ? new Date(dto.publishedAt) : null;
//   if (publishedAt && isNaN(+publishedAt))
//     throw new BadRequestException("publishedAt phải là ISO 8601");

//   try {
//     return await this.prisma.article.create({
//       data: { ...dto, publishedAt },
//     });
//   } catch (e) {
//     if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")
//       throw new BadRequestException("Slug đã tồn tại");
//     throw e;
//   }
// }

// async findAll(params: { page?: number; limit?: number; q?: string }) {
//   const page = Math.max(1, params.page ?? 1);
//   const limit = Math.min(100, Math.max(1, params.limit ?? 10));
//   const skip = (page - 1) * limit;

//   // Ép kiểu rõ ràng cho Prisma để khỏi lỗi TS2322
//   const where: Prisma.ArticleWhereInput = params.q
//     ? {
//         OR: [
//           { title:   { contains: params.q, mode: "insensitive" as const } },
//           { excerpt: { contains: params.q, mode: "insensitive" as const } },
//           { content: { contains: params.q, mode: "insensitive" as const } },
//           { author:  { contains: params.q, mode: "insensitive" as const } },
//         ],
//       }
//     : {};

//   const [items, total] = await this.prisma.$transaction([
//     this.prisma.article.findMany({
//       where,
//       orderBy: { publishedAt: "desc" },
//       skip,
//       take: limit,
//     }),
//     this.prisma.article.count({ where }),
//   ]);

//   return { items, page, limit, total };
// }

//   async findBySlug(slug: string) {
//     const article = await this.prisma.article.findUnique({ where: { slug } });
//     if (!article) throw new NotFoundException("Article not found");
//     return article;
//   }

//  async update(id: string, dto: UpdateArticleDto) {
//   try {
//     // an toàn cả khi TS chưa thấy publishedAt do lỗi import trước đó
//     const { publishedAt, ...rest } = dto as any;
//     return await this.prisma.article.update({
//       where: { id },
//       data: {
//         ...rest,
//         publishedAt: publishedAt ? new Date(publishedAt) : undefined,
//       },
//     });
//   } catch {
//     throw new NotFoundException("Article not found");
//   }
// }

//   async remove(id: string) {
//     try {
//       await this.prisma.article.delete({ where: { id } });
//       return { ok: true };
//     } catch {
//       throw new NotFoundException("Article not found");
//     }
//   }
// }









import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { ListArticlesDto } from "./dto/list-articles.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateArticleDto) {
    const publishedAt = dto.publishedAt ? new Date(dto.publishedAt) : null;
    if (publishedAt && isNaN(+publishedAt)) {
      throw new BadRequestException("publishedAt phải là ISO 8601");
    }
    try {
      return await this.prisma.article.create({
        data: { ...dto, publishedAt },
      });
    } catch (e: any) {
      if (e?.code === "P2002") throw new BadRequestException("Slug đã tồn tại");
      throw e;
    }
  }

  async findAll(params: ListArticlesDto) {
    const page  = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 12));
    const skip  = (page - 1) * limit;
    const q = (params.q ?? "").trim();

    const where: Prisma.ArticleWhereInput = q
      ? {
          OR: [
            { title:   { contains: q, mode: "insensitive" } },
            { excerpt: { contains: q, mode: "insensitive" } },
            { content: { contains: q, mode: "insensitive" } },
            { author:  { contains: q, mode: "insensitive" } },
          ],
        }
      : {};

    const [items, total] = await this.prisma.$transaction([
      this.prisma.article.findMany({
        where,
        orderBy: [
          { publishedAt: "desc" },
          { createdAt:   "desc" }, // ổn định thứ tự khi publishedAt null
        ],
        skip,
        take: limit,
        // Liệt kê field cần thiết cho trang danh sách để nhẹ payload
        select: {
          id: true, slug: true, title: true, excerpt: true,
          author: true, image: true, publishedAt: true,
        },
      }),
      this.prisma.article.count({ where }),
    ]);

    const pages   = Math.max(1, Math.ceil(total / limit));
    const hasPrev = page > 1;
    const hasNext = page < pages;

    return {
      items,
      meta: { page, limit, total, pages, hasPrev, hasNext },
    };
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article) throw new NotFoundException("Article not found");
    return article;
  }

  async update(id: string, dto: UpdateArticleDto) {
    try {
      const { publishedAt, ...rest } = dto as any;
      return await this.prisma.article.update({
        where: { id },
        data: {
          ...rest,
          publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        },
      });
    } catch {
      throw new NotFoundException("Article not found");
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.article.delete({ where: { id } });
      return { ok: true };
    } catch {
      throw new NotFoundException("Article not found");
    }
  }
}
