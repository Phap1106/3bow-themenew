



// // src/auth/auth.controller.ts
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
// } from "@nestjs/common";
// import { Response, Request } from "express";
// import { AuthService } from "./auth.service";
// import { RegisterSupportAdminDto } from "./dto/register-support-admin.dto";
// import { LoginDto } from "./dto/login.dto";
// import { UpdateSupportAdminDto } from "./dto/update-support-admin.dto";
// import { AuthGuard } from "@nestjs/passport";
// import { Roles } from "./roles.decorator";
// import { RolesGuard } from "./roles.guard";
// import { UserRole } from "@prisma/client";   


// @Controller("auth")
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   // Đăng ký SUPPORT_ADMIN (ADMIN có thể gọi từ phía BE khác nếu cần)
//   @Post("register-support-admin")
//   registerSupport(@Body() dto: RegisterSupportAdminDto) {
//     return this.authService.registerSupportAdmin(dto);
//   }

//   // Đăng nhập -> set cookie
//   @HttpCode(200)
//   @Post("login")
//   async login(
//     @Body() dto: LoginDto,
//     @Res({ passthrough: true }) res: Response
//   ) {
//     const { accessToken, refreshToken, user } =
//       await this.authService.login(dto);
//     const isProd = process.env.NODE_ENV === "production";

//     res.cookie("access_token", accessToken, {
//       httpOnly: true,
//       sameSite: "lax",
//       secure: isProd,
//       path: "/",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });
//     res.cookie("refresh_token", refreshToken, {
//       httpOnly: true,
//       sameSite: "lax",
//       secure: isProd,
//       path: "/",
//       maxAge: 30 * 24 * 60 * 60 * 1000,
//     });

//     return { ok: true, user };
//   }

//   // Đăng xuất -> xoá cookie
//   @Post("logout")
//   logout(@Res({ passthrough: true }) res: Response) {
//     res.clearCookie("access_token", { path: "/" });
//     res.clearCookie("refresh_token", { path: "/" });
//     return { ok: true };
//   }

//   // Lấy thông tin người dùng hiện tại
//   @UseGuards(AuthGuard("jwt"))
//   @Get("me")
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

//   // ADMIN cập nhật thông tin SUPPORT_ADMIN (không cho sửa email)
// @UseGuards(AuthGuard("jwt"), RolesGuard)
// @Roles(UserRole.ADMIN)                             // ✅ dùng enum, không dùng "ADMIN"
// @Put("support-admin/:id")
// updateSupport(
//   @Param("id") id: string,
//   @Body() dto: UpdateSupportAdminDto
// ) {
//   return this.authService.adminUpdateSupport(id, dto);
// }
// }









// src/auth/auth.controller.ts
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
} from "@nestjs/common";
import { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { RegisterSupportAdminDto } from "./dto/register-support-admin.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdateSupportAdminDto } from "./dto/update-support-admin.dto";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "./roles.decorator";
import { RolesGuard } from "./roles.guard";
import { UserRole } from "@prisma/client";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // === Đăng ký SUPPORT_ADMIN (có thể gọi từ BE hoặc ADMIN UI) ===
  @Post("register-support-admin")
  registerSupport(@Body() dto: RegisterSupportAdminDto) {
    return this.authService.registerSupportAdmin(dto);
  }

  // === Đăng nhập => set cookie ===
  @HttpCode(200)
  @Post("login")
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken, user } = await this.authService.login(dto);
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
    });

    return { ok: true, user };
  }

  // === Đăng xuất => xoá cookie ===
  @HttpCode(200)
  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("access_token", { path: "/" });
    res.clearCookie("refresh_token", { path: "/" });
    return { ok: true };
  }

  // === Lấy thông tin user hiện tại ===
  @UseGuards(AuthGuard("jwt"))
  @Get("me")
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

  // === ADMIN cập nhật SUPPORT_ADMIN (không cho sửa email) ===
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(UserRole.ADMIN) // dùng enum từ Prisma, tránh hardcode string
  @Put("support-admin/:id")
  updateSupport(
    @Param("id") id: string,
    @Body() dto: UpdateSupportAdminDto
  ) {
    return this.authService.adminUpdateSupport(id, dto);
  }
}



