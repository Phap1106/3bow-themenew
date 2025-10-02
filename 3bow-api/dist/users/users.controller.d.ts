import { UsersService } from "./users.service";
import { UpdateSupportAdminDto } from "./dto/update-support-admin.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAllSupport(page?: string, limit?: string, q?: string): Promise<{
        items: import("./user.entity").User[];
        total: number;
        page: number;
        limit: number;
    }>;
    list(q?: string, page?: string, limit?: string): Promise<{
        items: import("./user.entity").User[];
        total: number;
        page: number;
        limit: number;
    }>;
    updateSupport(id: string, dto: UpdateSupportAdminDto): Promise<import("./user.entity").User>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
    kick(id: string): Promise<{
        id: string;
    }>;
    getMyProfile(req: any): Promise<import("./user.entity").User>;
    getProfile(id: string, req: any): Promise<import("./user.entity").User>;
    updateMyProfile(dto: UpdateProfileDto, req: any): Promise<import("./user.entity").User>;
    updateProfile(id: string, dto: UpdateProfileDto, req: any): Promise<import("./user.entity").User>;
    deleteMyProfile(req: any): Promise<{
        ok: boolean;
    }>;
    deleteProfile(id: string, req: any): Promise<{
        ok: boolean;
    }>;
    debugImageInfo(req: any): Promise<{
        userId: string;
        hasImage: boolean;
        imageLength: number;
        isBase64: boolean;
        imagePreview: string | null;
        imageType: string | null;
    }>;
}
