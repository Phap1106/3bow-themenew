import { PrismaService } from "../prisma/prisma.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { ListArticlesDto } from "./dto/list-articles.dto";
export declare class ArticlesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateArticleDto): Promise<{
        id: string;
        slug: string;
        title: string;
        excerpt: string | null;
        content: string | null;
        author: string | null;
        publishedAt: Date | null;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(params: ListArticlesDto): Promise<{
        items: {
            id: string;
            slug: string;
            title: string;
            excerpt: string | null;
            author: string | null;
            publishedAt: Date | null;
            image: string | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            pages: number;
            hasPrev: boolean;
            hasNext: boolean;
        };
    }>;
    findBySlug(slug: string): Promise<{
        id: string;
        slug: string;
        title: string;
        excerpt: string | null;
        content: string | null;
        author: string | null;
        publishedAt: Date | null;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateArticleDto): Promise<{
        id: string;
        slug: string;
        title: string;
        excerpt: string | null;
        content: string | null;
        author: string | null;
        publishedAt: Date | null;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
