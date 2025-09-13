import { UsersService } from "./users.service";
import { UpdateSupportAdminDto } from "./dto/update-support-admin.dto";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAllSupport(page?: string, limit?: string, q?: string): Promise<{
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
    list(q?: string, page?: string, limit?: string): Promise<{
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
    updateSupport(id: string, dto: UpdateSupportAdminDto): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
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
    kick(id: string): Promise<{
        id: string;
    }>;
}
