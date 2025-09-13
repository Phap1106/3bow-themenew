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














import { Controller, Get, Query, Delete, Param, Post, Patch, Body } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateSupportAdminDto } from "./dto/update-support-admin.dto";

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
}
