import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RegisterSupportAdminDto } from './dto/register-support-admin.dto';
import { UpdateSupportAdminDto } from 'src/users/dto/update-support-admin.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { User } from 'src/users/user.entity';
import { EmailLoginChallenge } from './email-login-challenge.entity';
import { UserRole } from 'src/common/enums';

const CHALLENGE_TTL_MIN = 15;
const RESEND_COOLDOWN_SEC = 60;
const MAX_SEND_IN_HOUR = 3;
const MAX_VERIFY_WRONG = 5;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(EmailLoginChallenge)
    private challengeRepo: Repository<EmailLoginChallenge>,
    private jwt: JwtService,
    private mailer: MailerService,
  ) {}

  private norm(s?: string | null) {
    const v = (s ?? '').trim();
    return v.length ? v : undefined;
  }

  private generateSessionToken(): string {
    // Tạo session token unique
    return crypto.randomBytes(32).toString('hex');
  }
  private tooMany(msg = 'Too many requests'): never {
    throw new HttpException(msg, HttpStatus.TOO_MANY_REQUESTS);
  }
  private async signAccessToken(payload: {
    sub: string; email: string; role: UserRole; sv: number;
  }) {
    return this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'dev_secret',
      expiresIn: '7d',
    });
  }
  private async signRefreshToken(payload: { sub: string; sv: number }) {
    return this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev_secret',
      expiresIn: '30d',
    });
  }
  private setAuthCookies(res: any, accessToken: string, refreshToken: string) {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('access_token', accessToken, {
      httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  /* ===== REGISTER SUPPORT ADMIN ===== */
  async registerSupportAdmin(dto: RegisterSupportAdminDto) {
    const email = dto.email.toLowerCase().trim();
    const exists = await this.usersRepo.findOne({ where: { email }, select: { id: true } });
    if (exists) throw new BadRequestException('Email đã tồn tại');
    if (!dto.password || dto.password.length < 6) {
      throw new BadRequestException('Mật khẩu tối thiểu 6 ký tự');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const u = this.usersRepo.create({
      email,
      passwordHash: hash,
      firstName: this.norm(dto.firstName) ?? '',
      lastName: this.norm(dto.lastName) ?? '',
      phone: this.norm(dto.phone) ?? null,
      address: this.norm(dto.address) ?? null,
      img: this.norm(dto.img) ?? null,
      role: UserRole.SUPPORT_ADMIN,
      sessionVersion: 0,
    });
    const saved = await this.usersRepo.save(u);
    const { passwordHash, sessionVersion, ...safe } = saved;
    return safe;
  }

  /* ===== LOGIN (PASSWORD) ===== */
  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.usersRepo.findOne({
      where: { email },
      select: {
        id: true, email: true, passwordHash: true, role: true,
        firstName: true, lastName: true, phone: true, address: true, sessionVersion: true,
      },
    });
    if (!user) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');

    // Chấp nhận DB đang lưu plaintext (tự chuyển sang bcrypt lần đầu)
    const isBcrypt = /^\$2[aby]\$/.test(user.passwordHash || '');
    let ok = false;
    if (isBcrypt) {
      ok = await bcrypt.compare(dto.password, user.passwordHash);
    } else {
      if (dto.password === user.passwordHash) {
        const newHash = await bcrypt.hash(dto.password, 10);
        await this.usersRepo.update({ id: user.id }, { passwordHash: newHash });
        ok = true;
      }
    }
    if (!ok) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');

    // Tạo session token mới
    const sessionToken = this.generateSessionToken();
    
    // Cập nhật session vào database
    await this.usersRepo.update(
      { id: user.id },
      { 
        session: sessionToken,
        sessionVersion: (user.sessionVersion ?? 0) + 1, // Tăng version để invalidate old JWT
      }
    );

    const sv = (user.sessionVersion ?? 0) + 1;
    const accessToken = await this.signAccessToken({ sub: user.id, email: user.email, role: user.role as UserRole, sv });
    const refreshToken = await this.signRefreshToken({ sub: user.id, sv });

    return {
      accessToken,
      refreshToken,
      sessionToken, // Trả về session token để frontend có thể lưu
      user: {
        id: user.id, email: user.email, role: user.role,
        firstName: user.firstName, lastName: user.lastName, phone: user.phone, address: user.address,
      },
    };
  }

  /* ===== ADMIN update SUPPORT ADMIN ===== */
  async adminUpdateSupport(id: string, dto: UpdateSupportAdminDto) {
    const target = await this.usersRepo.findOne({
      where: { id }, select: { id: true, role: true, email: true, sessionVersion: true },
    });
    if (!target) throw new NotFoundException('Không tìm thấy user');
    if (target.role !== UserRole.SUPPORT_ADMIN) {
      throw new BadRequestException('Chỉ sửa được tài khoản Support Admin');
    }

    const patch: Partial<User> = {
      firstName: this.norm(dto.firstName),
      lastName: this.norm(dto.lastName),
      phone: this.norm(dto.phone) ?? null,
      address: this.norm(dto.address) ?? null,
    };

    if (dto.password && dto.password.length >= 6) {
      patch.passwordHash = await bcrypt.hash(dto.password, 10);
      patch.sessionVersion = (target.sessionVersion || 0) + 1;
    }

    await this.usersRepo.update({ id }, patch);
    const updated = await this.usersRepo.findOne({
      where: { id },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, address: true, role: true },
    });
    return updated!;
  }

  /* ================== OTP FLOW ================== */
  async loginVerifyStart(dto: LoginDto, next?: string, ip?: string, ua?: string) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.usersRepo.findOne({
      where: { email },
      select: {
        id: true, email: true, passwordHash: true, role: true,
        lockedUntil: true as any, loginAttemptCount: true as any, lastLoginAttemptAt: true as any,
      },
    } as any);
    if (!user) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');

    const now = new Date();
    if ((user as any).lockedUntil && (user as any).lockedUntil > now) {
      this.tooMany('Tài khoản bị khoá tạm thời. Vui lòng thử lại sau.');
    }

    // chấp nhận plaintext lần đầu
    const isBcrypt = /^\$2[aby]\$/.test(user.passwordHash || '');
    let ok = false;
    if (isBcrypt) ok = await bcrypt.compare(dto.password, user.passwordHash);
    else if (dto.password === user.passwordHash) {
      const newHash = await bcrypt.hash(dto.password, 10);
      await this.usersRepo.update({ id: user.id }, { passwordHash: newHash });
      ok = true;
    }
    if (!ok) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');

    // reset cửa sổ 1h
    let attempt = (user as any).loginAttemptCount || 0;
    if (!(user as any).lastLoginAttemptAt || now.getTime() - (user as any).lastLoginAttemptAt.getTime() >= 3600_000) {
      attempt = 0;
    }

    const sentInHour = await this.challengeRepo.count({
      where: { userId: user.id, createdAt: MoreThan(new Date(now.getTime() - 3600_000)) },
    });
    if (sentInHour >= MAX_SEND_IN_HOUR || attempt >= MAX_SEND_IN_HOUR) {
      await this.usersRepo.update(
        { id: user.id },
        { lockedUntil: new Date(now.getTime() + 3600_000) as any, loginAttemptCount: 0 as any, lastLoginAttemptAt: now as any } as any,
      );
      this.tooMany('Bạn đã thử quá nhiều lần, tài khoản bị khoá 1 giờ.');
    }

    const ch = await this.challengeRepo.save(
      this.challengeRepo.create({
        userId: user.id,
        codeHash: '',
        expiresAt: new Date(now.getTime() + CHALLENGE_TTL_MIN * 60 * 1000),
        ip, userAgent: ua, nextPath: next || '/',
        lastSentAt: new Date(now.getTime() - RESEND_COOLDOWN_SEC * 1000),
        sentCount: 0, verifyCount: 0,
      }),
    );

    await this.usersRepo.update(
      { id: user.id },
      { loginAttemptCount: attempt + 1, lastLoginAttemptAt: now as any } as any,
    );

    return { verifyRequired: true, challengeId: ch.id, resendAfterSec: 0 };
  }

  async loginVerifyResend(challengeId: string) {
    const now = new Date();
    const ch = await this.challengeRepo.findOne({ where: { id: challengeId }, relations: { user: true } });
    if (!ch) throw new BadRequestException('Challenge không hợp lệ');
    if (ch.usedAt || ch.expiresAt < now) throw new BadRequestException('Challenge đã hết hạn');

    const since = (now.getTime() - ch.lastSentAt.getTime()) / 1000;
    if (since < RESEND_COOLDOWN_SEC) {
      this.tooMany(`Vui lòng đợi ${Math.ceil(RESEND_COOLDOWN_SEC - since)}s để gửi lại.`);
    }

    const sentInHour = await this.challengeRepo.count({
      where: { userId: ch.userId, lastSentAt: MoreThan(new Date(now.getTime() - 3600_000)) },
    });
    if (sentInHour >= MAX_SEND_IN_HOUR) {
      await this.usersRepo.update(
        { id: ch.userId },
        { lockedUntil: new Date(now.getTime() + 3600_000) as any, loginAttemptCount: 0 as any, lastLoginAttemptAt: now as any } as any,
      );
      this.tooMany('Bạn đã thử quá nhiều lần, tài khoản bị khoá 1 giờ.');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(code, 10);

    await this.mailer.sendOtp(ch.user.email, code);
    await this.challengeRepo.update({ id: ch.id }, { codeHash, sentCount: (ch.sentCount || 0) + 1, lastSentAt: now });

    return { ok: true, resendAfterSec: RESEND_COOLDOWN_SEC };
  }

  async loginVerifyVerify(challengeId: string, code: string, res: any): Promise<string> {
    const now = new Date();
    const ch = await this.challengeRepo.findOne({ where: { id: challengeId }, relations: { user: true } });
    if (!ch) throw new BadRequestException('Challenge không hợp lệ');
    if (ch.usedAt || ch.expiresAt < now) throw new BadRequestException('Mã đã hết hạn hoặc challenge không hợp lệ');

    if ((ch.verifyCount ?? 0) >= MAX_VERIFY_WRONG) {
      await this.usersRepo.update({ id: ch.userId }, { lockedUntil: new Date(now.getTime() + 3600_000) as any } as any);
      this.tooMany('Bạn nhập sai quá nhiều lần. Tài khoản bị khoá 1 giờ.');
    }

    const ok = await bcrypt.compare(String(code || ''), ch.codeHash || '');
    if (!ok) {
      await this.challengeRepo.update({ id: ch.id }, { verifyCount: (ch.verifyCount || 0) + 1 });
      throw new BadRequestException('Mã xác minh không đúng.');
    }

    await this.challengeRepo.update({ id: ch.id }, { usedAt: new Date() });

    // Tạo session token mới cho email login
    const sessionToken = this.generateSessionToken();
    const newSv = (ch.user.sessionVersion ?? 0) + 1;
    
    // Cập nhật session vào database
    await this.usersRepo.update(
      { id: ch.user.id },
      { 
        session: sessionToken,
        sessionVersion: newSv,
      }
    );

    const accessToken = await this.signAccessToken({ sub: ch.user.id, email: ch.user.email, role: ch.user.role as UserRole, sv: newSv });
    const refreshToken = await this.signRefreshToken({ sub: ch.user.id, sv: newSv });
    this.setAuthCookies(res, accessToken, refreshToken);
    return ch.nextPath || '/';
  }

  /* ===== LOGOUT ===== */
  async logout(userId: string): Promise<void> {
    // Clear session khi logout
    await this.usersRepo.update(
      { id: userId },
      { session: null }
    );
  }

  /* ===== FORCE LOGOUT BY EMAIL ===== */
  async forceLogoutByEmail(email: string): Promise<void> {
    const user = await this.usersRepo.findOne({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, sessionVersion: true },
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Clear session và tăng sessionVersion để invalidate tất cả JWT tokens
    await this.usersRepo.update(
      { id: user.id },
      { 
        session: null,
        sessionVersion: (user.sessionVersion ?? 0) + 1,
      }
    );
  }
}
