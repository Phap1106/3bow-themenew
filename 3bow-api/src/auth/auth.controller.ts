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
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterSupportAdminDto } from './dto/register-support-admin.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateSupportAdminDto } from 'src/users/dto/update-support-admin.dto';
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
      
    // FIX: Hardcode domain giống AuthService để đồng bộ
    const domain = '.3bowdigital.com'; 

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true, // Luôn true cho https
      path: '/',
      domain: domain, // <--- THÊM
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true, // Luôn true cho https
      path: '/',
      domain: domain, // <--- THÊM
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return { ok: true, user };
  }

  @HttpCode(200)
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Res({ passthrough: true }) res: Response, @Req() req: any) {
    // Clear session trong database
    if (req.user?.id) {
      await this.authService.logout(req.user.id);
    }

    // FIX: Cấu hình xóa cookie phải Y HỆT lúc tạo
    const domain = '.3bowdigital.com';

    const opts = {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: true,
      path: '/',
      domain: domain, // <--- QUAN TRỌNG NHẤT ĐỂ XÓA ĐƯỢC
    };
    
    res.clearCookie('access_token', opts);
    res.clearCookie('refresh_token', opts);
    
    // Ghi đè thêm 1 lần nữa cho chắc chắn sạch
    res.cookie('access_token', '', { ...opts, maxAge: 0 });
    res.cookie('refresh_token', '', { ...opts, maxAge: 0 });
    
    return { ok: true };
  }

  @HttpCode(200)
  @Post('force-logout')
  async forceLogout(@Body() body: { email: string }) {
    try {
      await this.authService.forceLogoutByEmail(body.email);
      return { ok: true, message: 'All sessions cleared successfully' };
    } catch (error) {
      return { ok: false, message: 'User not found or already logged out' };
    }
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
    // Hàm này dùng res.cookie bên trong AuthService nên đã được fix ở bước trước
    const next = await this.authService.loginVerifyVerify(
      body.challengeId,
      body.code,
      res,
    );
    return res.json({ ok: true, next });
  }
}