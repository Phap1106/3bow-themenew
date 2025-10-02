import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ListArticlesDto } from './dto/list-articles.dto';
import { Article } from './article.entity';
export declare class ArticlesService {
    private repo;
    constructor(repo: Repository<Article>);
    create(dto: CreateArticleDto): Promise<Article>;
    findAll(params: ListArticlesDto): Promise<{
        items: Article[];
        meta: {
            page: number;
            limit: number;
            total: number;
            pages: number;
            hasPrev: boolean;
            hasNext: boolean;
        };
    }>;
    findBySlug(slug: string): Promise<Article>;
    update(id: string, dto: UpdateArticleDto): Promise<Article>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
    bulkInsert(items: CreateArticleDto[]): Promise<{
        ok: number;
        fail: number;
        results: ({
            ok: boolean;
            slug: string;
            error?: undefined;
        } | {
            ok: boolean;
            error: any;
            slug?: undefined;
        })[];
    }>;
    private ensureUniqueSlug;
    private runPool;
}
