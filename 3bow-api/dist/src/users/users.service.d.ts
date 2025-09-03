import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    listSupportAdmins(q?: string, page?: number, limit?: number): Promise<{
        items: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            session: string | null;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    delete(id: string): Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        password: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        birthday: Date | null;
        address: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        session: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    kick(id: string): Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        password: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        birthday: Date | null;
        address: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        session: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
}
