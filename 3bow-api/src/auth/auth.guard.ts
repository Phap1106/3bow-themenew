import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}
  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest<Request>();
    const token = (req.cookies?.session ||
      (req.headers['x-session'] as string | undefined))?.trim();
    if (!token) return false;
    const user = await this.usersRepo.findOne({ where: { session: token } as any });
    if (!user) return false;
    (req as any).user = user;
    return true;
  }
}
