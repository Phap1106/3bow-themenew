import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterSupportAdminDto } from './dto/register-support-admin.dto';
import { UpdateSupportAdminDto } from 'src/users/dto/update-support-admin.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { EmailLoginChallenge } from './email-login-challenge.entity';
import { UserRole } from 'src/common/enums';
export declare class AuthService {
    private usersRepo;
    private challengeRepo;
    private jwt;
    private mailer;
    constructor(usersRepo: Repository<User>, challengeRepo: Repository<EmailLoginChallenge>, jwt: JwtService, mailer: MailerService);
    private norm;
    private generateSessionToken;
    private tooMany;
    private signAccessToken;
    private signRefreshToken;
    private setAuthCookies;
    registerSupportAdmin(dto: RegisterSupportAdminDto): Promise<{
        id: string;
        email: string;
        firstName?: string | null;
        lastName?: string | null;
        phone?: string | null;
        address?: string | null;
        img?: string | null;
        role: UserRole;
        session?: string | null;
        lockedUntil?: Date | null;
        loginAttemptCount: number;
        lastLoginAttemptAt?: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        sessionToken: string;
        user: {
            id: string;
            email: string;
            role: UserRole;
            firstName: string | null | undefined;
            lastName: string | null | undefined;
            phone: string | null | undefined;
            address: string | null | undefined;
        };
    }>;
    adminUpdateSupport(id: string, dto: UpdateSupportAdminDto): Promise<User>;
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
    logout(userId: string): Promise<void>;
    forceLogoutByEmail(email: string): Promise<void>;
}
