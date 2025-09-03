
// // src/auth/roles.decorator.ts
// import { SetMetadata } from "@nestjs/common";
// import { UserRole } from "@prisma/client";

// export const ROLES_KEY = "roles";
// export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
// // (Nếu muốn linh hoạt hơn có thể dùng: (...roles: (UserRole | string)[]) )





// src/auth/roles.decorator.ts
import { SetMetadata } from "@nestjs/common";
export const ROLES_KEY = "roles";
export const Roles = (...roles: Array<"ADMIN" | "SUPPORT_ADMIN">) => SetMetadata(ROLES_KEY, roles);
