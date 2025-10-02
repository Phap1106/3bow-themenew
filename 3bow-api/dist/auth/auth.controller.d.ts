import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterSupportAdminDto } from './dto/register-support-admin.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateSupportAdminDto } from 'src/users/dto/update-support-admin.dto';
import { UserRole } from 'src/common/enums';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerSupport(dto: RegisterSupportAdminDto): Promise<{
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
    login(dto: LoginDto, res: Response): Promise<{
        ok: boolean;
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
    logout(res: Response, req: any): Promise<{
        ok: boolean;
    }>;
    forceLogout(body: {
        email: string;
    }): Promise<{
        ok: boolean;
        message: string;
    }>;
    me(req: Request & {
        user?: any;
    }): {
        id: any;
        email: any;
        role: any;
        firstName: any;
        lastName: any;
        phone: any;
        address: any;
    };
    updateSupport(id: string, dto: UpdateSupportAdminDto): Promise<import("../users/user.entity").User>;
    startLoginVerify(dto: LoginDto & {
        next?: string;
    }, req: Request): Promise<{
        verifyRequired: boolean;
        challengeId: string;
        resendAfterSec: number;
    }>;
    resendLoginVerify(challengeId: string): Promise<{
        ok: boolean;
        resendAfterSec: number;
    }>;
    verifyLogin(body: {
        challengeId: string;
        code: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
}
