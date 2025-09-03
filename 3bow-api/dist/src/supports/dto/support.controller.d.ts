import { SupportService } from "./support.service";
import { CreateSupportDto } from "./create-support.dto";
export declare class SupportController {
    private readonly svc;
    constructor(svc: SupportService);
    list(q?: string, page?: string, limit?: string): Promise<{
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
