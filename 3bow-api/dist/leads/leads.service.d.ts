import { Repository } from 'typeorm';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ListLeadDto } from './dto/list-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
export declare class LeadsService {
    private readonly repo;
    constructor(repo: Repository<Lead>);
    create(dto: CreateLeadDto, meta: {
        ip?: string;
        userAgent?: string;
    }): Promise<Lead>;
    findAll(q: ListLeadDto & {
        q?: string;
    }): Promise<{
        items: Lead[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Lead>;
    update(id: string, dto: UpdateLeadDto): Promise<Lead>;
    markSpam(id: string): Promise<Lead>;
    remove(id: string): Promise<void>;
}
