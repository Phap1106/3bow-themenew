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
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UpdateSupportAdminDto } from './dto/update-support-admin.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './user.entity';
import { UserRole } from 'src/common/enums';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findSupport(params: { page?: number; limit?: number; q?: string }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 10));
    const q = (params.q ?? '').trim();

    const where: any = { role: UserRole.SUPPORT_ADMIN };
    if (q) {
      where['email'] = ILike(`%${q}%`);
      // OR cho firstName/lastName/phone
      // TypeORM where OR cách 2: truyền mảng
      const wheres = [
        { role: UserRole.SUPPORT_ADMIN, email: ILike(`%${q}%`) },
        { role: UserRole.SUPPORT_ADMIN, firstName: ILike(`%${q}%`) },
        { role: UserRole.SUPPORT_ADMIN, lastName: ILike(`%${q}%`) },
        { role: UserRole.SUPPORT_ADMIN, phone: ILike(`%${q}%`) },
      ];
      const [items, total] = await this.repo.findAndCount({
        where: wheres,
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          address: true,
          img: true,
          role: true,
          session: true,
          createdAt: true,
          passwordHash: false,
          sessionVersion: false,
          updatedAt: false,
        },
      });
      return { items, total, page, limit };
    }

    const [items, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        img: true,
        role: true,
        session: true,
        createdAt: true,
        passwordHash: false,
        sessionVersion: false,
        updatedAt: false,
      },
    });

    return { items, total, page, limit };
  }

  listSupportAdmins(q = '', page = 1, limit = 20) {
    return this.findSupport({ q, page, limit });
  }

  async updateSupportAdmin(id: string, dto: UpdateSupportAdminDto) {
    const u = await this.repo.findOne({
      where: { id },
      select: { id: true, role: true, sessionVersion: true },
    });
    if (!u) throw new NotFoundException('User không tồn tại');
    if (u.role !== UserRole.SUPPORT_ADMIN)
      throw new BadRequestException('Chỉ cập nhật Support Admin');

    const data: Partial<User> = {
      firstName: dto.firstName ?? undefined,
      lastName: dto.lastName ?? undefined,
      phone: dto.phone ?? undefined,
      address: dto.address ?? undefined,
      img: dto.img ?? undefined,
    };

    if (dto.password && dto.password.length >= 6) {
      (data as any).passwordHash = await bcrypt.hash(dto.password, 10);
      (data as any).sessionVersion = (u.sessionVersion || 0) + 1;
    }

    await this.repo.update({ id }, data);

    const updated = await this.repo.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        img: true,
        createdAt: true,
      },
    });
    return updated!;
  }

  async kick(id: string) {
    const u = await this.repo.findOne({
      where: { id },
      select: { sessionVersion: true },
    });
    if (!u) throw new NotFoundException('User không tồn tại');
    await this.repo.update({ id }, { 
      sessionVersion: (u.sessionVersion || 0) + 1,
      session: null, // Clear session khi kick
    });
    return { id };
  }

  async delete(id: string) {
    try {
      await this.kick(id);
    } catch {}
    await this.repo.delete({ id });
    return { ok: true };
  }

  // ===== PROFILE MANAGEMENT =====
  
  async getProfile(userId: string) {
    const user = await this.repo.findOne({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        img: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (!user) throw new NotFoundException('User không tồn tại');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto, requesterId?: string) {
    const user = await this.repo.findOne({
      where: { id: userId },
      select: { id: true, role: true, sessionVersion: true },
    });
    
    if (!user) throw new NotFoundException('User không tồn tại');
    
    // Chỉ cho phép admin sửa profile của support admin, hoặc user sửa profile của chính mình
    if (requesterId && requesterId !== userId) {
      const requester = await this.repo.findOne({
        where: { id: requesterId },
        select: { role: true },
      });
      if (!requester || requester.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Không có quyền sửa profile này');
      }
    }

    const data: Partial<User> = {};
    
    // Chỉ cập nhật các field có giá trị
    if (dto.firstName !== undefined) data.firstName = dto.firstName;
    if (dto.lastName !== undefined) data.lastName = dto.lastName;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.address !== undefined) data.address = dto.address;
    if (dto.img !== undefined) data.img = dto.img;

    // Nếu có đổi mật khẩu
    if (dto.password && dto.password.length >= 6) {
      (data as any).passwordHash = await bcrypt.hash(dto.password, 10);
      (data as any).sessionVersion = (user.sessionVersion || 0) + 1;
    }

    await this.repo.update({ id: userId }, data);

    return this.getProfile(userId);
  }

  async deleteProfile(userId: string, requesterId?: string) {
    const user = await this.repo.findOne({
      where: { id: userId },
      select: { id: true, role: true },
    });
    
    if (!user) throw new NotFoundException('User không tồn tại');
    
    // Chỉ cho phép admin xóa profile của support admin, hoặc user xóa profile của chính mình
    if (requesterId && requesterId !== userId) {
      const requester = await this.repo.findOne({
        where: { id: requesterId },
        select: { role: true },
      });
      if (!requester || requester.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Không có quyền xóa profile này');
      }
    }

    return this.delete(userId);
  }
}
