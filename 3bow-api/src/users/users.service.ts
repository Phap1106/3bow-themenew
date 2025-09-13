// //users.service.ts
// import { Injectable } from "@nestjs/common";
// import { PrismaService } from "../prisma/prisma.service";
// import { Prisma, UserRole } from "@prisma/client";

// @Injectable()
// export class UsersService {
//   constructor(private prisma: PrismaService) {}

//   listSupportAdmins(q = "", page = 1, limit = 20) {
//     const where: Prisma.UserWhereInput = {
//       role: UserRole.SUPPORT_ADMIN,
//       ...(q ? {
//         OR: [
//           { email:     { contains: q, mode: "insensitive" } },
//           { firstName: { contains: q, mode: "insensitive" } },
//           { lastName:  { contains: q, mode: "insensitive" } },
//           { phone:     { contains: q, mode: "insensitive" } },
//         ],
//       } : {}),
//     };

//     return this.prisma.$transaction([
//       this.prisma.user.findMany({
//         where,
//         skip: (page - 1) * limit,
//         take: limit,
//         orderBy: { createdAt: "desc" },
//         select: { id:true,email:true,firstName:true,lastName:true,phone:true,session:true,createdAt:true },
//       }),
//       this.prisma.user.count({ where }),
//     ]).then(([items,total]) => ({ items,total,page,limit }));
//   }

//   delete(id: string) { return this.prisma.user.delete({ where: { id } }); }
//   kick(id: string)   { return this.prisma.user.update({ where: { id }, data: { session: null } }); }
// }











// import { Injectable } from "@nestjs/common";
// import { PrismaService } from "../prisma/prisma.service";
// import { Prisma, UserRole } from "@prisma/client";


// @Injectable()
// export class UsersService {
//   constructor(private prisma: PrismaService) {}

  
//   // API chuẩn: /users/support?page=&limit=&q=
//   async findSupport(params: { page?: number; limit?: number; q?: string }) {
//     const page = Math.max(1, params.page ?? 1);
//     const limit = Math.min(100, Math.max(1, params.limit ?? 10));
//     const q = (params.q ?? "").trim();

//     const where: Prisma.UserWhereInput = {
//       role: UserRole.SUPPORT_ADMIN,
//       ...(q
//         ? {
//             OR: [
//               { email: { contains: q, mode: "insensitive" } },
//               { firstName: { contains: q, mode: "insensitive" } },
//               { lastName: { contains: q, mode: "insensitive" } },
//               { phone: { contains: q, mode: "insensitive" } },
//             ],
//           }
//         : {}),
//     };

//     const [items, total] = await this.prisma.$transaction([
//       this.prisma.user.findMany({
//         where,
//         orderBy: { createdAt: "desc" },
//         skip: (page - 1) * limit,
//         take: limit,
//         select: {
//           id: true,
//           email: true,
//           firstName: true,
//           lastName: true,
//           phone: true,
//           role: true,
//           createdAt: true,
//         },
//       }),
//       this.prisma.user.count({ where }),
//     ]);

//     return { items, total, page, limit };
//   }

//   // Alias (nếu FE cũ đang gọi /users/support-admins): dùng lại findSupport để tránh duplicate logic
//   listSupportAdmins(q = "", page = 1, limit = 20) {
//     return this.findSupport({ q, page, limit });
//   }

  

//   delete(id: string) {
//     return this.prisma.user.delete({ where: { id } });
//   }

//   // Nếu model có cột `session`, giữ nguyên. Không có thì bỏ dòng data.session.
//   kick(id: string) {
//     return this.prisma.user.update({
//       where: { id },
//       data: { session: null as any }, // hoặc xoá nếu schema không có cột `session`
//     });
//   }
// }

















import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, UserRole } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { UpdateSupportAdminDto } from "./dto/update-support-admin.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findSupport(params: { page?: number; limit?: number; q?: string }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 10));
    const q = (params.q ?? "").trim();

    const where: Prisma.UserWhereInput = {
      role: UserRole.SUPPORT_ADMIN,
      ...(q
        ? {
            OR: [
              { email: { contains: q, mode: "insensitive" } },
              { firstName: { contains: q, mode: "insensitive" } },
              { lastName: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  listSupportAdmins(q = "", page = 1, limit = 20) {
    return this.findSupport({ q, page, limit });
  }

  async updateSupportAdmin(id: string, dto: UpdateSupportAdminDto) {
    const u = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });
    if (!u) throw new NotFoundException("User không tồn tại");
    if (u.role !== UserRole.SUPPORT_ADMIN)
      throw new BadRequestException("Chỉ cập nhật Support Admin");

    const data: Prisma.UserUpdateInput = {
      firstName: dto.firstName ?? undefined,
      lastName: dto.lastName ?? undefined,
      phone: dto.phone ?? undefined,
     // address: dto.address ?? undefined,
    };

    if (dto.password && dto.password.length >= 6) {
      (data as any).password = await bcrypt.hash(dto.password, 10);
      (data as any).sessionVersion = { increment: 1 };
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
      },
    });
  }

  async kick(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { sessionVersion: { increment: 1 } } as any,
      select: { id: true },
    });
  }

  async delete(id: string) {
    await this.prisma.user
      .update({
        where: { id },
        data: { sessionVersion: { increment: 1 } } as any,
      })
      .catch(() => {});
    return this.prisma.user.delete({ where: { id } });
  }
}
