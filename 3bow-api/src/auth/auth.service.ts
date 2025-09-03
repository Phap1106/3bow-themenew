// //auth/auth.service.ts
// import { Injectable, BadRequestException, UnauthorizedException } from "@nestjs/common";
// import { PrismaService } from "../prisma/prisma.service";
// import { JwtService } from "@nestjs/jwt";
// import * as bcrypt from "bcryptjs";
// import { LoginDto } from "./dto/login.dto";
// import { RegisterSupportAdminDto } from "./dto/register-support-admin.dto";
// import { UserRole } from "@prisma/client";

// @Injectable()
// export class AuthService {
//   constructor(private prisma: PrismaService, private jwt: JwtService) {}

//   async registerSupportAdmin(dto: RegisterSupportAdminDto) {
//     const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
//     if (exists) throw new BadRequestException("Email đã tồn tại");
//     const hash = await bcrypt.hash(dto.password, 10);
//     const u = await this.prisma.user.create({
//       data: {
//         email: dto.email,
//         password: hash,
//         firstName: dto.firstName ?? "",
//         lastName: dto.lastName ?? "",
//         role: "SUPPORT_ADMIN",
//       },
//       select: { id: true, email: true, role: true, firstName: true, lastName: true },
//     });
//     return u;
//   }

//   async login(dto: LoginDto) {
//     const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
//     if (!user) throw new UnauthorizedException("Email hoặc mật khẩu không đúng");
//     const ok = await bcrypt.compare(dto.password, user.password);
//     if (!ok) throw new UnauthorizedException("Email hoặc mật khẩu không đúng");

//     const accessToken = await this.jwt.signAsync(
//       { sub: user.id, email: user.email, role: user.role as UserRole },
//       { expiresIn: "7d" },
//     );
//     const refreshToken = await this.jwt.signAsync(
//       { sub: user.id, typ: "refresh" },
//       { secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "dev_secret", expiresIn: "30d" },
//     );

//     return {
//       accessToken,
//       refreshToken,
//       user: {
//         id: user.id,
//         email: user.email,
//         role: user.role as UserRole,
//         firstName: user.firstName,
//         lastName: user.lastName,
//       },
//     };
//   }
// }

  









// src/auth/auth.service.ts
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { LoginDto } from "./dto/login.dto";
import { RegisterSupportAdminDto } from "./dto/register-support-admin.dto";
import { UpdateSupportAdminDto } from "./dto/update-support-admin.dto";
import { UserRole } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  // ==== helpers ====
  private async signAccessToken(payload: {
    sub: string;
    email: string;
    role: UserRole;
  }) {
    return this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET || "dev_secret",
      expiresIn: "7d",
    });
  }

  private async signRefreshToken(userId: string) {
    return this.jwt.signAsync(
      { sub: userId, typ: "refresh" },
      {
        secret:
          process.env.JWT_REFRESH_SECRET ||
          process.env.JWT_SECRET ||
          "dev_secret",
        expiresIn: "30d",
      }
    );
  }

  // ==== register SUPPORT_ADMIN ====
  async registerSupportAdmin(dto: RegisterSupportAdminDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });
    if (exists) throw new BadRequestException("Email đã tồn tại");

    const hash = await bcrypt.hash(dto.password, 10);
    const u = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        firstName: dto.firstName?.trim() || "",
        lastName: dto.lastName?.trim() || "",
        phone: dto.phone?.trim() || null,
        address: dto.address?.trim() || null,
        role: "SUPPORT_ADMIN",
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
      },
    });

    return u;
  }

  // ==== login ====
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user)
      throw new UnauthorizedException("Email hoặc mật khẩu không đúng");

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok)
      throw new UnauthorizedException("Email hoặc mật khẩu không đúng");

    const accessToken = await this.signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role as UserRole,
    });
    const refreshToken = await this.signRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
      },
    };
  }

  // ==== ADMIN update SUPPORT_ADMIN (không cho đổi email) ====
  async adminUpdateSupport(id: string, dto: UpdateSupportAdminDto) {
    const target = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, email: true },
    });
    if (!target) throw new NotFoundException("Không tìm thấy user");
    if (target.role !== "SUPPORT_ADMIN")
      throw new BadRequestException("Chỉ sửa được tài khoản Support Admin");

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        // KHÔNG có email ở đây
        firstName: dto.firstName ?? undefined,
        lastName: dto.lastName ?? undefined,
        phone: dto.phone ?? undefined,
        address: dto.address ?? undefined,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        role: true,
      },
    });

    return updated;
  }
}
