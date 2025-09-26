import { Request } from 'express';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ListLeadDto } from './dto/list-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    create(dto: CreateLeadDto, req: Request): Promise<import("./lead.entity").Lead>;
    findAll(q: ListLeadDto): Promise<{
        items: import("./lead.entity").Lead[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("./lead.entity").Lead>;
    update(id: string, dto: UpdateLeadDto): Promise<import("./lead.entity").Lead>;
    markSpam(id: string): Promise<import("./lead.entity").Lead>;
    remove(id: string): Promise<void>;
    removeCompat(id: string): Promise<{
        ok: boolean;
    }>;
}
