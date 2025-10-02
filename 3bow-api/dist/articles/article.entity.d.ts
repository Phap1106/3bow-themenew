export declare class Article {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    image?: string | null;
    author?: string | null;
    publishedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
