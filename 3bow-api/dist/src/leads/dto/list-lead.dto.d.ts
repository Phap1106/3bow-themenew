import { LeadStatus } from "@prisma/client";
export declare class ListLeadDto {
    status?: LeadStatus;
    page?: number;
    pageSize?: number;
}
