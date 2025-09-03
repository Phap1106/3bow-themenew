import { PrismaService } from "../prisma/prisma.service";
import { CreateSupportDto } from "./dto/create-support.dto";
export declare class SupportService {
    private prisma;
    constructor(prisma: PrismaService);
    list({ q, page, limit }: {
        q?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        items: any;
        total: any;
        page: number;
        limit: number;
    }>;
    create(dto: CreateSupportDto): any;
    delete(id: string): any;
    kick(id: string): any;
}
