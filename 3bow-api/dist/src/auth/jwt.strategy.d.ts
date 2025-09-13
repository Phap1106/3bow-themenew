import { Strategy } from "passport-jwt";
import { PrismaService } from "../prisma/prisma.service";
type JwtPayload = {
    sub: string;
    sv: number;
    role?: string;
    email?: string;
};
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        id: ({
            id: string;
            createdAt: Date;
            token: string;
            codeHash: string;
            expiresAt: Date;
            usedAt: Date | null;
            lastSentAt: Date;
            sentCount: number;
            verifyCount: number;
            ip: string | null;
            userAgent: string | null;
            nextPath: string | null;
            userId: string;
        } | {
            id: string;
            createdAt: Date;
            token: string;
            codeHash: string;
            expiresAt: Date;
            usedAt: Date | null;
            lastSentAt: Date;
            sentCount: number;
            verifyCount: number;
            ip: string | null;
            userAgent: string | null;
            nextPath: string | null;
            userId: string;
        })[] | {
            id: string;
            createdAt: Date;
            token: string;
            codeHash: string;
            expiresAt: Date;
            usedAt: Date | null;
            lastSentAt: Date;
            sentCount: number;
            verifyCount: number;
            ip: string | null;
            userAgent: string | null;
            nextPath: string | null;
            userId: string;
        }[];
        role: ({
            id: string;
            createdAt: Date;
            token: string;
            codeHash: string;
            expiresAt: Date;
            usedAt: Date | null;
            lastSentAt: Date;
            sentCount: number;
            verifyCount: number;
            ip: string | null;
            userAgent: string | null;
            nextPath: string | null;
            userId: string;
        } | {
            id: string;
            createdAt: Date;
            token: string;
            codeHash: string;
            expiresAt: Date;
            usedAt: Date | null;
            lastSentAt: Date;
            sentCount: number;
            verifyCount: number;
            ip: string | null;
            userAgent: string | null;
            nextPath: string | null;
            userId: string;
        })[] | {
            id: string;
            createdAt: Date;
            token: string;
            codeHash: string;
            expiresAt: Date;
            usedAt: Date | null;
            lastSentAt: Date;
            sentCount: number;
            verifyCount: number;
            ip: string | null;
            userAgent: string | null;
            nextPath: string | null;
            userId: string;
        }[];
    }>;
}
export {};
