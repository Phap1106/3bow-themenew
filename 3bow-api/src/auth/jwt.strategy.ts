// // src/auth/jwt.strategy.ts
// import { Injectable } from "@nestjs/common";
// import { PassportStrategy } from "@nestjs/passport";
// import { ExtractJwt, Strategy as JwtStrategyBase } from "passport-jwt";
// import { Request } from "express";
// import { PrismaService } from "../prisma/prisma.service";
// import { UserRole } from "@prisma/client";

// function cookieExtractor(req: Request): string | null {
//   return (req as any)?.cookies?.["access_token"] ?? null;
// }

// @Injectable()
// export class JwtStrategy extends PassportStrategy(JwtStrategyBase) {
//   constructor(private prisma: PrismaService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         cookieExtractor,
//         ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ]),
//       ignoreExpiration: false,
//       secretOrKey: process.env.JWT_SECRET || "dev_secret",
//     });
//   }

//   async validate(payload: { sub: string; email: string; role: UserRole }) {
//     return this.prisma.user.findUnique({
//       where: { id: payload.sub },
//       select: { id: true, email: true, role: true, firstName: true, lastName: true },
//     });
//   }

  
// }



import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Request } from 'express';

type JwtPayload = { sub: string; sv: number; role?: string; email?: string };

function cookieExtractor(req: Request): string | null {
  return (req as any)?.cookies?.['access_token'] ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.JWT_SECRET || 'dev_secret',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersRepo.findOne({
      where: { id: payload.sub },
      select: { id: true, role: true, sessionVersion: true, email: true, session: true },
    });
    
    if (!user) {
      throw new UnauthorizedException('User deleted');
    }

    // Sửa logic so sánh sessionVersion - cả hai đều dùng default value giống nhau
    const userSv = user.sessionVersion ?? 0;
    const payloadSv = payload.sv ?? 0;
    
    if (userSv !== payloadSv) {
      throw new UnauthorizedException('Session revoked');
    }

    // Kiểm tra session - nếu không có session thì yêu cầu đăng nhập lại
    if (!user.session) {
      throw new UnauthorizedException('No active session - please login again');
    }

    return { id: user.id, email: user.email, role: user.role };
  }
}
