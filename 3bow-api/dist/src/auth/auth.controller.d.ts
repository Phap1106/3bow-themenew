import { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { RegisterSupportAdminDto } from "./dto/register-support-admin.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdateSupportAdminDto } from "./dto/update-support-admin.dto";
import { UserRole } from "@prisma/client";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerSupport(dto: RegisterSupportAdminDto): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        address: string | null;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        ok: boolean;
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
    logout(res: Response): {
        ok: boolean;
    };
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
    updateSupport(id: string, dto: UpdateSupportAdminDto): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        address: string | null;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
}
