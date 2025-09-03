import { PrismaService } from "src/prisma/prisma.service";
import { CreateSupportDto } from "./create-support.dto";
export declare class SupportService {
    private prisma;
    constructor(prisma: PrismaService);
    list(opts: {
        q?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        id: string;
        name: string;
        email: string | null;
        phone2: string | null;
        role: import(".prisma/client").$Enums.SupportRole;
        active: boolean;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(dto: CreateSupportDto): Promise<{
        id: string;
        name: string;
        email: string | null;
        phone2: string | null;
        role: import(".prisma/client").$Enums.SupportRole;
        active: boolean;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<{
        id: string;
        name: string;
        email: string | null;
        phone2: string | null;
        role: import(".prisma/client").$Enums.SupportRole;
        active: boolean;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    kick(id: string): Promise<{
        ok: boolean;
        id: string;
        kicked: boolean;
    }>;
}
