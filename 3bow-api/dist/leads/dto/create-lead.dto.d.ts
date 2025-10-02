import { BudgetRange, LeadChannel, ServiceType } from '../enums';
export declare class CreateLeadDto {
    name: string;
    phone: string;
    email?: string;
    url?: string;
    service?: ServiceType;
    serviceText?: string;
    budget?: BudgetRange;
    note?: string;
    consent?: boolean;
    channel?: LeadChannel;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
    referrer?: string;
    pagePath?: string;
}
