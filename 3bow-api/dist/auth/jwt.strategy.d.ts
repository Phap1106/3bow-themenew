import { Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
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
    private usersRepo;
    constructor(usersRepo: Repository<User>);
    validate(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        role: import("../common/enums").UserRole;
    }>;
}
export {};
