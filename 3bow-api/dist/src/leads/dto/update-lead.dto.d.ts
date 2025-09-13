import { LeadStatus } from "@prisma/client";
export declare class UpdateLeadDto {
    status?: LeadStatus;
    assignedToId?: string;
}
