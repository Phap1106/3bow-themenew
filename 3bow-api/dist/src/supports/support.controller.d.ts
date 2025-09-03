import { SupportService } from "./support.service";
import { CreateSupportDto } from "./dto/create-support.dto";
export declare class SupportController {
    private readonly svc;
    constructor(svc: SupportService);
    list(q?: string, page?: string, limit?: string): Promise<{
        items: any;
        total: any;
        page: number;
        limit: number;
    }>;
    create(dto: CreateSupportDto): any;
    delete(id: string): any;
    kick(id: string): any;
}
