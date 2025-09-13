import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { RegisterSupportAdminDto } from "./dto/register-support-admin.dto";
import { UpdateSupportAdminDto } from "../users/dto/update-support-admin.dto";
import { UserRole } from "@prisma/client";
import { MailerService } from "../mailer/mailer.service";
export declare class AuthService {
    private prisma;
    private jwt;
    private mailer;
    constructor(prisma: PrismaService, jwt: JwtService, mailer: MailerService);
    private norm;
    private tooMany;
    private signAccessToken;
    private signRefreshToken;
    private setAuthCookies;
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
    loginVerifyStart(dto: LoginDto, next?: string, ip?: string, ua?: string): Promise<{
        verifyRequired: boolean;
        challengeId: string;
        resendAfterSec: number;
    }>;
    loginVerifyResend(challengeId: string): Promise<{
        ok: boolean;
        resendAfterSec: number;
    }>;
    loginVerifyVerify(challengeId: string, code: string, res: any): Promise<string>;
}
