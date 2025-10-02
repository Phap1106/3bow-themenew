// import { Controller, Get, Query, Delete, Param, Post } from "@nestjs/common";
// import { UsersService } from "./users.service";

// @Controller("users")
// export class UsersController {
//   constructor(private svc: UsersService) {}


//   @Get("support-admins")
//   list(
//     @Query("q") q = "",
//     @Query("page") page = "1",
//     @Query("limit") limit = "20",
//   ) {
//     return this.svc.listSupportAdmins(q, Number(page), Number(limit));
//   }

//   @Delete(":id") remove(@Param("id") id: string) { return this.svc.delete(id); }
//   @Post(":id/kick") kick(@Param("id") id: string) { return this.svc.kick(id); }
// }









// import { Controller, Get, Query, Delete, Param, Post } from "@nestjs/common";
// import { UsersService } from "./users.service";
// import { UpdateSupportAdminDto } from "./dto/update-support-admin.dto";


// @Controller("users")
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}

//   @Get("support")
//   findAllSupport(
//     @Query("page") page?: string,
//     @Query("limit") limit?: string,
//     @Query("q") q?: string
//   ) {
//     const p = Number.isFinite(Number(page)) ? parseInt(page!, 10) : 1;
//     const l = Number.isFinite(Number(limit)) ? parseInt(limit!, 10) : 10;
//     return this.usersService.findSupport({ page: p, limit: l, q: q || "" });
//   }

//   // Alias route (tuỳ bạn cần hay không). FE cũ có thể đang gọi /users/support-admins
//   @Get("support-admins")
//   list(
//     @Query("q") q = "",
//     @Query("page") page = "1",
//     @Query("limit") limit = "20"
//   ) {
//     return this.usersService.listSupportAdmins(q, Number(page), Number(limit));
//   }


// @Patch("support-admins/:id")
// updateSupport(@Param("id") id: string, @Body() dto: UpdateSupportAdminDto) {
//   return this.usersService.updateSupportAdmin(id, dto);
// }
//   @Delete(":id")
//   remove(@Param("id") id: string) {
//     return this.usersService.delete(id);
//   }

//   @Post(":id/kick")
//   kick(@Param("id") id: string) {
//     return this.usersService.kick(id);
//   }
// }














import { Controller, Get, Query, Delete, Param, Post, Patch, Body, UseGuards, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "./users.service";
import { UpdateSupportAdminDto } from "./dto/update-support-admin.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("support")
  findAllSupport(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("q") q?: string
  ) {
    const p = Number.isFinite(Number(page)) ? parseInt(page!, 10) : 1;
    const l = Number.isFinite(Number(limit)) ? parseInt(limit!, 10) : 10;
    return this.usersService.findSupport({ page: p, limit: l, q: q || "" });
  }

  // Alias cho FE cũ: /users/support-admins
  @Get("support-admins")
  list(@Query("q") q = "", @Query("page") page = "1", @Query("limit") limit = "20") {
    return this.usersService.listSupportAdmins(q, Number(page), Number(limit));
  }

  // Cập nhật
  @Patch("support-admins/:id")
  updateSupport(@Param("id") id: string, @Body() dto: UpdateSupportAdminDto) {
    return this.usersService.updateSupportAdmin(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.delete(id);
  }

  @Post(":id/kick")
  kick(@Param("id") id: string) {
    return this.usersService.kick(id);
  }

  // ===== PROFILE MANAGEMENT =====
  
  @UseGuards(AuthGuard('jwt'))
  @Get("profile")
  getMyProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("profile/:id")
  getProfile(@Param("id") id: string, @Req() req: any) {
    // Admin có thể xem profile của support admin, user chỉ xem được profile của mình
    const requesterId = req.user.id;
    if (requesterId !== id && req.user.role !== 'ADMIN') {
      return this.usersService.getProfile(requesterId); // Trả về profile của chính mình
    }
    return this.usersService.getProfile(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch("profile")
  updateMyProfile(@Body() dto: UpdateProfileDto, @Req() req: any) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch("profile/:id")
  updateProfile(@Param("id") id: string, @Body() dto: UpdateProfileDto, @Req() req: any) {
    return this.usersService.updateProfile(id, dto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete("profile")
  deleteMyProfile(@Req() req: any) {
    return this.usersService.deleteProfile(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete("profile/:id")
  deleteProfile(@Param("id") id: string, @Req() req: any) {
    return this.usersService.deleteProfile(id, req.user.id);
  }

  // Debug endpoint để kiểm tra dữ liệu ảnh
  @UseGuards(AuthGuard('jwt'))
  @Get("debug/image-info")
  async debugImageInfo(@Req() req: any) {
    const user = await this.usersService.getProfile(req.user.id);
    return {
      userId: user.id,
      hasImage: !!user.img,
      imageLength: user.img ? user.img.length : 0,
      isBase64: user.img ? user.img.startsWith('data:image/') : false,
      imagePreview: user.img ? user.img.substring(0, 100) + '...' : null,
      imageType: user.img ? (user.img.match(/data:image\/([^;]+)/) || [])[1] : null
    };
  }
}
