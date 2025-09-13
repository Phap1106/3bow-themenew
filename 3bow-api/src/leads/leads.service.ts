import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service"; // dùng service prisma có sẵn của dự án
import { CreateLeadDto } from "./dto/create-lead.dto";
import { ListLeadDto } from "./dto/list-lead.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { LeadStatus } from "@prisma/client";

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLeadDto, meta: { ip?: string; userAgent?: string }) {
    return this.prisma.lead.create({
      data: {
        ...dto,
        ip: meta.ip,
        userAgent: meta.userAgent,
      },
    });
  }

  async findAll(q: ListLeadDto) {
    const where: any = {};
    if (q.status) where.status = q.status;

    const skip = (q.page ?? 0) * (q.pageSize ?? 20);
    const take = q.pageSize ?? 20;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      this.prisma.lead.count({ where }),
    ]);

    return {
      items,
      total,
      page: q.page ?? 0,
      pageSize: q.pageSize ?? 20,
      totalPages: Math.ceil(total / (q.pageSize ?? 20)),
    };
  }

  async findOne(id: string) {
    return this.prisma.lead.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateLeadDto) {
    return this.prisma.lead.update({ where: { id }, data: dto });
  }

  async markSpam(id: string) {
    return this.prisma.lead.update({
      where: { id },
      data: { status: LeadStatus.SPAM },
    });
  }
}
