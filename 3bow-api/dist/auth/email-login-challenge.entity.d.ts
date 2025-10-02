import { User } from 'src/users/user.entity';
export declare class EmailLoginChallenge {
    id: string;
    userId: string;
    user: User;
    codeHash: string;
    expiresAt: Date;
    usedAt?: Date | null;
    ip?: string | null;
    userAgent?: string | null;
    nextPath?: string | null;
    lastSentAt: Date;
    sentCount: number;
    verifyCount: number;
    createdAt: Date;
    updatedAt: Date;
}
