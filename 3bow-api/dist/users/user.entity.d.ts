import { UserRole } from 'src/common/enums';
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    address?: string | null;
    role: UserRole;
    sessionVersion: number;
    lockedUntil?: Date | null;
    loginAttemptCount: number;
    lastLoginAttemptAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
