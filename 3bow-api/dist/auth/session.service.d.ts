import { Repository } from 'typeorm';
import { UserSession } from './session.entity';
import { User } from 'src/users/user.entity';
export declare class SessionService {
    private sessionRepo;
    private userRepo;
    constructor(sessionRepo: Repository<UserSession>, userRepo: Repository<User>);
    private parseUserAgent;
    private hashToken;
    createSession(userId: string, accessToken: string, refreshToken: string, ipAddress?: string, userAgent?: string): Promise<UserSession>;
    private updateUserLoginInfo;
    updateActivity(accessToken: string): Promise<void>;
    getUserSessions(userId: string): Promise<UserSession[]>;
    getActiveSessions(userId: string): Promise<UserSession[]>;
    revokeSession(accessToken: string): Promise<void>;
    revokeAllUserSessions(userId: string): Promise<number>;
    cleanupExpiredSessions(): Promise<number>;
    getSessionStats(userId?: string): Promise<{
        totalSessions: number;
        activeSessions: number;
        todaySessions: number;
    }>;
    validateSession(accessToken: string): Promise<UserSession | null>;
}
