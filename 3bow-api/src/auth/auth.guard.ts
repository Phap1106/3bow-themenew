import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest<Request>();
    const token = (req.cookies?.session || req.headers["x-session"]) as string | undefined;
    if (!token) return false;
    const user = await this.prisma.user.findFirst({ where: { session: token } });
    if (!user) return false;
    (req as any).user = user;
    return true;
  }
}
