import { Repository } from 'typeorm';
import { UpdateSupportAdminDto } from './dto/update-support-admin.dto';
import { User } from './user.entity';
export declare class UsersService {
    private repo;
    constructor(repo: Repository<User>);
    findSupport(params: {
        page?: number;
        limit?: number;
        q?: string;
    }): Promise<{
        items: User[];
        total: number;
        page: number;
        limit: number;
    }>;
    listSupportAdmins(q?: string, page?: number, limit?: number): Promise<{
        items: User[];
        total: number;
        page: number;
        limit: number;
    }>;
    updateSupportAdmin(id: string, dto: UpdateSupportAdminDto): Promise<User>;
    kick(id: string): Promise<{
        id: string;
    }>;
    delete(id: string): Promise<{
        ok: boolean;
    }>;
}
