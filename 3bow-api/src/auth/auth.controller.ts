import {
  Body,
  Controller,
  Post,
  Res,
  Get,
  UseGuards,
  Req,
  HttpCode,
  Put,
  Param,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterSupportAdminDto } from './dto/register-support-admin.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateSupportAdminDto } from 'src/users/dto/update-support-admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { UserRole } from 'src/common/enums';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-support-admin')
  registerSupport(@Body() dto: RegisterSupportAdminDto) {
    return this.authService.registerSupportAdmin(dto);
  }

  @HttpCode(200)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(dto);
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return { ok: true, user };
  }

  @HttpCode(200)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    const isProd = process.env.NODE_ENV === 'production';
    const opts = {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: isProd,
      path: '/',
    };
    res.clearCookie('access_token', opts);
    res.clearCookie('refresh_token', opts);
    res.cookie('access_token', '', { ...opts, maxAge: 0 });
    res.cookie('refresh_token', '', { ...opts, maxAge: 0 });
    return { ok: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Req() req: Request & { user?: any }) {
    const u = req.user!;
    return {
      id: u.id,
      email: u.email,
      role: u.role,
      firstName: u.firstName,
      lastName: u.lastName,
      phone: u.phone,
      address: u.address,
    };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('support-admin/:id')
  updateSupport(
    @Param('id') id: string,
    @Body() dto: UpdateSupportAdminDto,
  ) {
    return this.authService.adminUpdateSupport(id, dto);
  }

  /* OTP login */
  @Post('login-verify/start')
  startLoginVerify(
    @Body() dto: LoginDto & { next?: string },
    @Req() req: Request,
  ) {
      console.log('[POST] /auth/login-verify/start', dto.email); // LOG
    return this.authService.loginVerifyStart(
      dto,
      dto.next,
      req.ip,
      req.headers['user-agent'] as string,
    );
  }

  @Post('login-verify/resend')
  resendLoginVerify(@Body('challengeId') challengeId: string) {
    return this.authService.loginVerifyResend(challengeId);
  }

  @Post('login-verify/verify')
  async verifyLogin(
    @Body() body: { challengeId: string; code: string },
    @Res() res: Response,
  ) {
    const next = await this.authService.loginVerifyVerify(
      body.challengeId,
      body.code,
      res,
    );
    return res.json({ ok: true, next });
  }
}
