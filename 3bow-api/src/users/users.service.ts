import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, UserRole } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  listSupportAdmins(q = "", page = 1, limit = 20) {
    const where: Prisma.UserWhereInput = {
      role: UserRole.SUPPORT_ADMIN,
      ...(q ? {
        OR: [
          { email:     { contains: q, mode: "insensitive" } },
          { firstName: { contains: q, mode: "insensitive" } },
          { lastName:  { contains: q, mode: "insensitive" } },
          { phone:     { contains: q, mode: "insensitive" } },
        ],
      } : {}),
    };

    return this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: { id:true,email:true,firstName:true,lastName:true,phone:true,session:true,createdAt:true },
      }),
      this.prisma.user.count({ where }),
    ]).then(([items,total]) => ({ items,total,page,limit }));
  }

  delete(id: string) { return this.prisma.user.delete({ where: { id } }); }
  kick(id: string)   { return this.prisma.user.update({ where: { id }, data: { session: null } }); }
}
