// // auth/auth.service.ts

// import {
//   Injectable,
//   BadRequestException,
//   UnauthorizedException,
//   NotFoundException,
// } from "@nestjs/common";
// import { PrismaService } from "../prisma/prisma.service";
// import { JwtService } from "@nestjs/jwt";
// import * as bcrypt from "bcryptjs";
// import { LoginDto } from "./dto/login.dto";
// import { RegisterSupportAdminDto } from "./dto/register-support-admin.dto";
// // SỬA IMPORT: dùng DTO ở module users
// import { UpdateSupportAdminDto } from "../users/dto/update-support-admin.dto";
// import { Prisma, UserRole } from "@prisma/client";

// @Injectable()
// export class AuthService {
//   constructor(private prisma: PrismaService, private jwt: JwtService) {}

//   private norm(s?: string | null) {
//     const v = (s ?? "").trim();
//     return v.length ? v : undefined;
//   }

//   private async signAccessToken(payload: {
//     sub: string;
//     email: string;
//     role: UserRole;
//     sv: number;
//   }) {
//     return this.jwt.signAsync(payload, {
//       secret: process.env.JWT_SECRET || "dev_secret",
//       expiresIn: "7d",
//     });
//   }

//   private async signRefreshToken(payload: { sub: string; sv: number }) {
//     return this.jwt.signAsync(payload, {
//       secret:
//         process.env.JWT_REFRESH_SECRET ||
//         process.env.JWT_SECRET ||
//         "dev_secret",
//       expiresIn: "30d",
//     });
//   }

//   // REGISTER SUPPORT_ADMIN
//   async registerSupportAdmin(dto: RegisterSupportAdminDto) {
//     const email = dto.email.toLowerCase().trim();
//     const exists = await this.prisma.user.findUnique({
//       where: { email },
//       select: { id: true },
//     });
//     if (exists) throw new BadRequestException("Email đã tồn tại");
//     if (!dto.password || dto.password.length < 6)
//       throw new BadRequestException("Mật khẩu tối thiểu 6 ký tự");

//     const hash = await bcrypt.hash(dto.password, 10);

//     return this.prisma.user.create({
//       data: {
//         email,
//         password: hash, // cột 'password'
//         firstName: this.norm(dto.firstName) ?? "",
//         lastName: this.norm(dto.lastName) ?? "",
//         phone: this.norm(dto.phone) ?? null,
//         address: this.norm(dto.address) ?? null,
//         role: UserRole.SUPPORT_ADMIN,
//       },
//       select: {
//         id: true, email: true, role: true,
//         firstName: true, lastName: true, phone: true, address: true,
//       },
//     });
//   }

//   // LOGIN
//   async login(dto: LoginDto) {
//     const email = dto.email.toLowerCase().trim();
//     const user = await this.prisma.user.findUnique({
//       where: { email },
//       // dùng as any nếu Prisma Client chưa regenerate có field sessionVersion
//       select: {
//         id: true, email: true, password: true, role: true,
//         firstName: true, lastName: true, phone: true, address: true,
//         sessionVersion: true,
//       } as any,
//     });
//     if (!user) throw new UnauthorizedException("Email hoặc mật khẩu không đúng");

//     const ok = await bcrypt.compare(dto.password, (user as any).password);
//     if (!ok) throw new UnauthorizedException("Email hoặc mật khẩu không đúng");

//     const sv = (user as any).sessionVersion ?? 0;
//     const accessToken = await this.signAccessToken({
//       sub: (user as any).id,
//       email: (user as any).email,
//       role: (user as any).role as UserRole,
//       sv,
//     });
//     const refreshToken = await this.signRefreshToken({ sub: (user as any).id, sv });

//     return {
//       accessToken,
//       refreshToken,
//       user: {
//         id: (user as any).id,
//         email: (user as any).email,
//         role: (user as any).role as UserRole,
//         firstName: (user as any).firstName,
//         lastName: (user as any).lastName,
//         phone: (user as any).phone,
//         address: (user as any).address,
//       },
//     };
//   }

//   // ADMIN UPDATE SUPPORT (không đổi email)
//   async adminUpdateSupport(id: string, dto: UpdateSupportAdminDto) {
//     const target = await this.prisma.user.findUnique({
//       where: { id },
//       select: { id: true, role: true, email: true },
//     });
//     if (!target) throw new NotFoundException("Không tìm thấy user");
//     if (target.role !== UserRole.SUPPORT_ADMIN)
//       throw new BadRequestException("Chỉ sửa được tài khoản Support Admin");

//     const data: Prisma.UserUpdateInput = {
//       firstName: this.norm(dto.firstName),
//       lastName: this.norm(dto.lastName),
//       phone: this.norm(dto.phone) ?? null,
//       address: this.norm(dto.address) ?? null,
//     };

//     // Đổi mật khẩu -> hash + revoke session
//     if (dto.password && dto.password.length >= 6) {
//       (data as any).password = await bcrypt.hash(dto.password, 10);
//       (data as any).sessionVersion = { increment: 1 };
//     }

//     return this.prisma.user.update({
//       where: { id },
//       data,
//       select: {
//         id: true, email: true,
//         firstName: true, lastName: true, phone: true, address: true, role: true,
//       },
//     });
//   }
// }
















 // auth/auth.service.ts
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { LoginDto } from "./dto/login.dto";
import { RegisterSupportAdminDto } from "./dto/register-support-admin.dto";
import { UpdateSupportAdminDto } from "../users/dto/update-support-admin.dto";
import { Prisma, UserRole } from "@prisma/client";
import { MailerService } from "../mailer/mailer.service";

// ===== OTP constants =====
const CHALLENGE_TTL_MIN  = 15;      // OTP sống 15'
const RESEND_COOLDOWN_SEC = 60;     // gửi lại sau 60s
const MAX_SEND_IN_HOUR    = 3;      // quá 3 lần/giờ -> khoá 1h
const MAX_VERIFY_WRONG    = 5;      // nhập sai quá 5 lần -> khoá 1h

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mailer: MailerService,
  ) {}

  // ========== helpers ==========
  private norm(s?: string | null) {
    const v = (s ?? "").trim();
    return v.length ? v : undefined;
  }

  private tooMany(msg = "Too many requests"): never {
    throw new HttpException(msg, HttpStatus.TOO_MANY_REQUESTS);
  }

  private async signAccessToken(payload: {
    sub: string; email: string; role: UserRole; sv: number;
  }) {
    return this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET || "dev_secret",
      expiresIn: "7d",
    });
  }

  private async signRefreshToken(payload: { sub: string; sv: number }) {
    return this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "dev_secret",
      expiresIn: "30d",
    });
  }

  private setAuthCookies(res: any, accessToken: string, refreshToken: string) {
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("access_token", accessToken, {
      httpOnly: true, sameSite: "lax", secure: isProd, path: "/", maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true, sameSite: "lax", secure: isProd, path: "/", maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  // ================== LOGIC CŨ (giữ nguyên) ==================
  async registerSupportAdmin(dto: RegisterSupportAdminDto) {
    const email = dto.email.toLowerCase().trim();
    const exists = await this.prisma.user.findUnique({
      where: { email }, select: { id: true },
    });
    if (exists) throw new BadRequestException("Email đã tồn tại");
    if (!dto.password || dto.password.length < 6)
      throw new BadRequestException("Mật khẩu tối thiểu 6 ký tự");

    const hash = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email,
        password: hash,
        firstName: this.norm(dto.firstName) ?? "",
        lastName: this.norm(dto.lastName) ?? "",
        phone: this.norm(dto.phone) ?? null,
        address: this.norm(dto.address) ?? null,
        role: UserRole.SUPPORT_ADMIN,
      },
      select: {
        id: true, email: true, role: true,
        firstName: true, lastName: true, phone: true, address: true,
      },
    });
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true, email: true, password: true, role: true,
        firstName: true, lastName: true, phone: true, address: true,
        sessionVersion: true,
      },
    });
    if (!user) throw new UnauthorizedException("Email hoặc mật khẩu không đúng");

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException("Email hoặc mật khẩu không đúng");

    const sv = user.sessionVersion ?? 0;
    const accessToken = await this.signAccessToken({
      sub: user.id, email: user.email, role: user.role as UserRole, sv,
    });
    const refreshToken = await this.signRefreshToken({ sub: user.id, sv });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id, email: user.email, role: user.role as UserRole,
        firstName: user.firstName, lastName: user.lastName,
        phone: user.phone, address: user.address,
      },
    };
  }

  async adminUpdateSupport(id: string, dto: UpdateSupportAdminDto) {
    const target = await this.prisma.user.findUnique({
      where: { id }, select: { id: true, role: true, email: true },
    });
    if (!target) throw new NotFoundException("Không tìm thấy user");
    if (target.role !== UserRole.SUPPORT_ADMIN)
      throw new BadRequestException("Chỉ sửa được tài khoản Support Admin");

    const data: Prisma.UserUpdateInput = {
      firstName: this.norm(dto.firstName),
      lastName: this.norm(dto.lastName),
      phone: this.norm(dto.phone) ?? null,
      address: this.norm(dto.address) ?? null,
    };

    if (dto.password && dto.password.length >= 6) {
      (data as any).password = await bcrypt.hash(dto.password, 10);
      (data as any).sessionVersion = { increment: 1 } as any;
    }

    return this.prisma.user.update({
      where: { id }, data,
      select: {
        id: true, email: true, firstName: true, lastName: true, phone: true, address: true, role: true,
      },
    });
  }
  // ==========================================================

  // ===================== OTP FLOW =====================

  /** Bước 1: START – chỉ tạo challenge, chưa gửi email */
  async loginVerifyStart(dto: LoginDto, next?: string, ip?: string, ua?: string) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true, email: true, password: true, role: true,
        lockedUntil: true, loginAttemptCount: true, lastLoginAttemptAt: true,
      },
    });
    if (!user) throw new UnauthorizedException("Email hoặc mật khẩu không đúng");

    const now = new Date();
    if (user.lockedUntil && user.lockedUntil > now)
      this.tooMany("Tài khoản bị khoá tạm thời. Vui lòng thử lại sau.");

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException("Email hoặc mật khẩu không đúng");

    // reset cửa sổ 1h
    let attempt = user.loginAttemptCount || 0;
    if (!user.lastLoginAttemptAt || now.getTime() - user.lastLoginAttemptAt.getTime() >= 3600_000)
      attempt = 0;

    // rate limit 1h
    const sentInHour = await this.prisma.emailLoginChallenge.count({
      where: { userId: user.id, createdAt: { gt: new Date(now.getTime() - 3600_000) } },
    });
    if (sentInHour >= MAX_SEND_IN_HOUR || attempt >= MAX_SEND_IN_HOUR) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lockedUntil: new Date(now.getTime() + 3600_000), loginAttemptCount: 0, lastLoginAttemptAt: now },
      });
      this.tooMany("Bạn đã thử quá nhiều lần, tài khoản bị khoá 1 giờ.");
    }

    // tạo challenge (chưa gửi mã)
    const ch = await this.prisma.emailLoginChallenge.create({
      data: {
        userId: user.id,
        codeHash: "", // sẽ set khi gửi OTP
        expiresAt: new Date(now.getTime() + CHALLENGE_TTL_MIN * 60 * 1000),
        ip,
        userAgent: ua,
        nextPath: next || "/",
        lastSentAt: new Date(now.getTime() - RESEND_COOLDOWN_SEC * 1000), // cho phép gửi ngay
      } as any,
      select: { id: true },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { loginAttemptCount: attempt + 1, lastLoginAttemptAt: now },
    });

    return { verifyRequired: true, challengeId: ch.id, resendAfterSec: 0 };
  }

  /** Bước 2: RESEND – thực tế là GỬI MÃ */
  async loginVerifyResend(challengeId: string) {
    const now = new Date();
    const ch = await this.prisma.emailLoginChallenge.findUnique({
      where: { id: challengeId },
      include: { user: { select: { id: true, email: true } } },
    }) as any;

    if (!ch) throw new BadRequestException("Challenge không hợp lệ");
    if (ch.usedAt || ch.expiresAt < now) throw new BadRequestException("Challenge đã hết hạn");

    const since = (now.getTime() - new Date(ch.lastSentAt).getTime()) / 1000;
    if (since < RESEND_COOLDOWN_SEC)
      this.tooMany(`Vui lòng đợi ${Math.ceil(RESEND_COOLDOWN_SEC - since)}s để gửi lại.`);

    // rate limit 3 lần / 1h
    const sentInHour = await this.prisma.emailLoginChallenge.count({
      where: { userId: ch.userId, lastSentAt: { gt: new Date(now.getTime() - 3600_000) } },
    });
    if (sentInHour >= MAX_SEND_IN_HOUR) {
      await this.prisma.user.update({
        where: { id: ch.userId },
        data: { lockedUntil: new Date(now.getTime() + 3600_000), loginAttemptCount: 0, lastLoginAttemptAt: now },
      });
      this.tooMany("Bạn đã thử quá nhiều lần, tài khoản bị khoá 1 giờ.");
    }

    // Tạo OTP + hash và gửi mail
    const code = (Math.floor(100000 + Math.random() * 900000)).toString();
    const codeHash = await bcrypt.hash(code, 10);

    await this.mailer.sendOtp(ch.user.email, code);

    await this.prisma.emailLoginChallenge.update({
      where: { id: ch.id },
      data: { codeHash, sentCount: { increment: 1 } as any, lastSentAt: now } as any,
    });

    return { ok: true, resendAfterSec: RESEND_COOLDOWN_SEC };
  }

  /** Bước 3: VERIFY – kiểm tra mã, phát cookie */
   async loginVerifyVerify(challengeId: string, code: string, res: any): Promise<string> {
    const now = new Date();
    const ch = await this.prisma.emailLoginChallenge.findUnique({
      where: { id: challengeId },
      include: {
        user: { select: { id: true, email: true, role: true, sessionVersion: true } },
      },
    }) as any;

    if (!ch) throw new BadRequestException("Challenge không hợp lệ");
    if (ch.usedAt || ch.expiresAt < now)
      throw new BadRequestException("Mã đã hết hạn hoặc challenge không hợp lệ");

    if ((ch.verifyCount ?? 0) >= 5) {
      await this.prisma.user.update({
        where: { id: ch.userId },
        data: { lockedUntil: new Date(now.getTime() + 3600_000) },
      });
      this.tooMany("Bạn nhập sai quá nhiều lần. Tài khoản bị khoá 1 giờ.");
    }

    const ok = await bcrypt.compare(String(code || ""), ch.codeHash || "");
    if (!ok) {
      await this.prisma.emailLoginChallenge.update({
        where: { id: ch.id },
        data: { verifyCount: { increment: 1 } as any } as any,
      });
      throw new BadRequestException("Mã xác minh không đúng.");
    }

    // đánh dấu đã dùng
    await this.prisma.emailLoginChallenge.update({
      where: { id: ch.id },
      data: { usedAt: new Date() } as any,
    });

    // phát token
    const sv = ch.user.sessionVersion ?? 0;
    const accessToken = await this.signAccessToken({
      sub: ch.user.id, email: ch.user.email, role: ch.user.role as UserRole, sv,
    });
    const refreshToken = await this.signRefreshToken({ sub: ch.user.id, sv });
    this.setAuthCookies(res, accessToken, refreshToken);

    // CHỈ trả về string đích
    return ch.nextPath || "/";
  }
}
