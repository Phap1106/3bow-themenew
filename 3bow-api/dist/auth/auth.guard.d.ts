import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
export declare class SessionGuard implements CanActivate {
    private usersRepo;
    constructor(usersRepo: Repository<User>);
    canActivate(ctx: ExecutionContext): Promise<boolean>;
}
