import { UsersService } from "./users.service";
import { UpdateSupportAdminDto } from "./dto/update-support-admin.dto";
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
}
