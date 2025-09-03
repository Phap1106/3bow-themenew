import { SupportRole } from "@prisma/client";
export declare class CreateSupportDto {
    name: string;
    email?: string;
    phone?: string;
    role?: SupportRole | string;
    active?: boolean | string;
    note?: string;
}
