import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ListArticlesDto } from './dto/list-articles.dto';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    create(dto: CreateArticleDto): Promise<import("./article.entity").Article>;
    createBulk(body: {
        items: CreateArticleDto[];
    }): Promise<{
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
    findAll(q: ListArticlesDto): Promise<{
        items: import("./article.entity").Article[];
        meta: {
            page: number;
            limit: number;
            total: number;
            pages: number;
            hasPrev: boolean;
            hasNext: boolean;
        };
    }>;
    findOne(slug: string): Promise<import("./article.entity").Article>;
    update(id: string, dto: UpdateArticleDto): Promise<import("./article.entity").Article>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
