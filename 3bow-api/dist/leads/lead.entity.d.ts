import { BudgetRange, LeadChannel, LeadStatus, ServiceType } from './enums';
export declare class Lead {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    url?: string | null;
    service?: ServiceType | null;
    serviceText?: string | null;
    budget?: BudgetRange | null;
    note?: string | null;
    consent: boolean;
    channel?: LeadChannel | null;
    utmSource?: string | null;
    utmMedium?: string | null;
    utmCampaign?: string | null;
    utmTerm?: string | null;
    utmContent?: string | null;
    referrer?: string | null;
    pagePath?: string | null;
    ip?: string | null;
    userAgent?: string | null;
    status: LeadStatus;
    assignedToId?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
