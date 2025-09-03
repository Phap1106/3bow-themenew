// src/auth/jwt.strategy.ts
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy as JwtStrategyBase } from "passport-jwt";
import { Request } from "express";
import { PrismaService } from "../prisma/prisma.service";
import { UserRole } from "@prisma/client";

function cookieExtractor(req: Request): string | null {
  return (req as any)?.cookies?.["access_token"] ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(JwtStrategyBase) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "dev_secret",
    });
  }

  async validate(payload: { sub: string; email: string; role: UserRole }) {
    return this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, firstName: true, lastName: true },
    });
  }
}
