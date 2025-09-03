

// // src/auth/roles.guard.ts
// import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";
// import { ROLES_KEY } from "./roles.decorator";
// import { UserRole } from "@prisma/client";

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(ctx: ExecutionContext): boolean {
//     const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
//       ctx.getHandler(),
//       ctx.getClass(),
//     ]);
//     if (!required || required.length === 0) return true;

//     const { user } = ctx.switchToHttp().getRequest();
//     // user.role là string từ JWT: 'ADMIN' | 'SUPPORT_ADMIN'
//     return required.includes(user?.role as UserRole);
//   }
// }






// src/auth/roles.guard.ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Array<string>>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!roles || roles.length === 0) return true;
    const req = ctx.switchToHttp().getRequest();
    const user = req.user; // từ auth guard JWT
    return !!user && roles.includes(user.role);
  }
}
