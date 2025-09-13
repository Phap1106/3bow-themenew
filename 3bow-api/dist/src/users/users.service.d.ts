import { PrismaService } from "../prisma/prisma.service";
import { UpdateSupportAdminDto } from "./dto/update-support-admin.dto";
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findSupport(params: {
        page?: number;
        limit?: number;
        q?: string;
    }): Promise<{
        items: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    listSupportAdmins(q?: string, page?: number, limit?: number): Promise<{
        items: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    updateSupportAdmin(id: string, dto: UpdateSupportAdminDto): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    kick(id: string): Promise<{
        id: string;
    }>;
    delete(id: string): Promise<{
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
        sessionVersion: number;
        emailVerified: Date | null;
        lockedUntil: Date | null;
        loginAttemptCount: number;
        lastLoginAttemptAt: Date | null;
    }>;
}
