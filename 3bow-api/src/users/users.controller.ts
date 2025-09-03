import { Controller, Get, Query, Delete, Param, Post } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private svc: UsersService) {}

  @Get("support-admins")
  list(
    @Query("q") q = "",
    @Query("page") page = "1",
    @Query("limit") limit = "20",
  ) {
    return this.svc.listSupportAdmins(q, Number(page), Number(limit));
  }

  @Delete(":id") remove(@Param("id") id: string) { return this.svc.delete(id); }
  @Post(":id/kick") kick(@Param("id") id: string) { return this.svc.kick(id); }
}
