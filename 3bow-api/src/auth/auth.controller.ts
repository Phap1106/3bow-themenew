// import {
//   Body,
//   Controller,
//   Post,
//   Res,
//   Get,
//   UseGuards,
//   Req,
//   HttpCode,
//   Put,
//   Param,
// } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { Response, Request } from 'express';
// import { AuthService } from './auth.service';
// import { RegisterSupportAdminDto } from './dto/register-support-admin.dto';
// import { LoginDto } from './dto/login.dto';
// import { UpdateSupportAdminDto } from 'src/users/dto/update-support-admin.dto';
// import { Roles } from './roles.decorator';
// import { RolesGuard } from './roles.guard';
// import { UserRole } from 'src/common/enums';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('register-support-admin')
//   registerSupport(@Body() dto: RegisterSupportAdminDto) {
//     return this.authService.registerSupportAdmin(dto);
//   }

//   @HttpCode(200)
//   @Post('login')
//   async login(
//     @Body() dto: LoginDto,
//     @Res({ passthrough: true }) res: Response,
//   ) {
//     const { accessToken, refreshToken, user } =
//       await this.authService.login(dto);
//     const isProd = process.env.NODE_ENV === 'production';
//     res.cookie('access_token', accessToken, {
//       httpOnly: true,
//       sameSite: 'lax',
//       secure: isProd,
//       path: '/',
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });
//     res.cookie('refresh_token', refreshToken, {
//       httpOnly: true,
//       sameSite: 'lax',
//       secure: isProd,
//       path: '/',
//       maxAge: 30 * 24 * 60 * 60 * 1000,
//     });
//     return { ok: true, user };
//   }

//   @HttpCode(200)
//   @Post('logout')
//   @UseGuards(AuthGuard('jwt'))
//   async logout(@Res({ passthrough: true }) res: Response, @Req() req: any) {
//     // Clear session trong database
//     if (req.user?.id) {
//       await this.authService.logout(req.user.id);
//     }

//     const isProd = process.env.NODE_ENV === 'production';
//     const opts = {
//       httpOnly: true,
//       sameSite: 'lax' as const,
//       secure: isProd,
//       path: '/',
//     };
//     res.clearCookie('access_token', opts);
//     res.clearCookie('refresh_token', opts);
//     res.cookie('access_token', '', { ...opts, maxAge: 0 });
//     res.cookie('refresh_token', '', { ...opts, maxAge: 0 });
//     return { ok: true };
//   }

//   @HttpCode(200)
//   @Post('force-logout')
//   async forceLogout(@Body() body: { email: string }) {
//     // Endpoint để admin có thể force logout user bằng email
//     // Hoặc user tự force logout nếu bị stuck
//     try {
//       await this.authService.forceLogoutByEmail(body.email);
//       return { ok: true, message: 'All sessions cleared successfully' };
//     } catch (error) {
//       return { ok: false, message: 'User not found or already logged out' };
//     }
//   }

//   @UseGuards(AuthGuard('jwt'))
//   @Get('me')
//   me(@Req() req: Request & { user?: any }) {
//     const u = req.user!;
//     return {
//       id: u.id,
//       email: u.email,
//       role: u.role,
//       firstName: u.firstName,
//       lastName: u.lastName,
//       phone: u.phone,
//       address: u.address,
//     };
//   }

//   @UseGuards(AuthGuard('jwt'), RolesGuard)
//   @Roles(UserRole.ADMIN)
//   @Put('support-admin/:id')
//   updateSupport(
//     @Param('id') id: string,
//     @Body() dto: UpdateSupportAdminDto,
//   ) {
//     return this.authService.adminUpdateSupport(id, dto);
//   }

//   /* OTP login */
//   @Post('login-verify/start')
//   startLoginVerify(
//     @Body() dto: LoginDto & { next?: string },
//     @Req() req: Request,
//   ) {
//     return this.authService.loginVerifyStart(
//       dto,
//       dto.next,
//       req.ip,
//       req.headers['user-agent'] as string,
//     );
//   }

//   @Post('login-verify/resend')
//   resendLoginVerify(@Body('challengeId') challengeId: string) {
//     return this.authService.loginVerifyResend(challengeId);
//   }

//   @Post('login-verify/verify')
//   async verifyLogin(
//     @Body() body: { challengeId: string; code: string },
//     @Res() res: Response,
//   ) {
//     const next = await this.authService.loginVerifyVerify(
//       body.challengeId,
//       body.code,
//       res,
//     );
//     return res.json({ ok: true, next });
//   }
// }





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
    const { accessToken, refreshToken, user } = await this.authService.login(dto);
    
    // Dùng hàm chung của Service để set cookie chuẩn domain
    this.authService.setAuthCookies(res, accessToken, refreshToken);
    
    return { ok: true, user };
  }

  @HttpCode(200)
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Res({ passthrough: true }) res: Response, @Req() req: any) {
    if (req.user?.id) {
      await this.authService.logout(req.user.id);
    }

    // Cấu hình xóa cookie phải KHỚP Y HỆT lúc tạo (Quan trọng nhất là Domain)
    const domain = '.3bowdigital.com';
    const opts = {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: true,
      path: '/',
      domain: domain,
    };
    
    res.clearCookie('access_token', opts);
    res.clearCookie('refresh_token', opts);
    // Xóa bồi thêm lần nữa cho chắc
    res.cookie('access_token', '', { ...opts, maxAge: 0 });
    res.cookie('refresh_token', '', { ...opts, maxAge: 0 });
    
    return { ok: true };
  }

  @HttpCode(200)
  @Post('force-logout')
  async forceLogout(@Body() body: { email: string }) {
    try {
      await this.authService.forceLogoutByEmail(body.email);
      return { ok: true, message: 'OK' };
    } catch (error) {
      return { ok: false, message: 'Error' };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Req() req: Request & { user?: any }) {
    const u = req.user!;
    return {
      id: u.id, email: u.email, role: u.role,
      firstName: u.firstName, lastName: u.lastName,
      phone: u.phone, address: u.address,
    };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('support-admin/:id')
  updateSupport(@Param('id') id: string, @Body() dto: UpdateSupportAdminDto) {
    return this.authService.adminUpdateSupport(id, dto);
  }

  /* OTP Login Flow */
  @Post('login-verify/start')
  startLoginVerify(@Body() dto: LoginDto & { next?: string }, @Req() req: Request) {
    return this.authService.loginVerifyStart(dto, dto.next, req.ip, req.headers['user-agent'] as string);
  }

  @Post('login-verify/resend')
  resendLoginVerify(@Body('challengeId') challengeId: string) {
    return this.authService.loginVerifyResend(challengeId);
  }

  @Post('login-verify/verify')
  async verifyLogin(@Body() body: { challengeId: string; code: string }, @Res() res: Response) {
    const next = await this.authService.loginVerifyVerify(body.challengeId, body.code, res);
    return res.json({ ok: true, next });
  }
}