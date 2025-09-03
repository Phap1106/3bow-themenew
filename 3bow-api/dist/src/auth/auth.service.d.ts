import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { RegisterSupportAdminDto } from "./dto/register-support-admin.dto";
import { UpdateSupportAdminDto } from "./dto/update-support-admin.dto";
import { UserRole } from "@prisma/client";
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    private signAccessToken;
    private signRefreshToken;
    registerSupportAdmin(dto: RegisterSupportAdminDto): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        address: string | null;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: UserRole;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            address: string | null;
        };
    }>;
    adminUpdateSupport(id: string, dto: UpdateSupportAdminDto): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        address: string | null;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
}
