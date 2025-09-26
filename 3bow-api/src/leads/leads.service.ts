// src/leads/leads.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ListLeadDto } from './dto/list-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadStatus } from './enums';

@Injectable()
export class LeadsService {
  constructor(@InjectRepository(Lead) private readonly repo: Repository<Lead>) {}

  async create(dto: CreateLeadDto, meta: { ip?: string; userAgent?: string }) {
    const lead = this.repo.create({
      ...dto,
      ip: meta.ip,
      userAgent: meta.userAgent,
      consent: !!dto.consent,
      status: LeadStatus.NEW,
    });
    return this.repo.save(lead);
  }

  async findAll(q: ListLeadDto & { q?: string }) {
    const where: any = {};
    if (q.status) where.status = q.status;

    // search đơn giản
    if ((q as any).q) {
      const kw = (q as any).q.trim();
      where['$or'] = [
        { name: ILike(`%${kw}%`) },
        { phone: ILike(`%${kw}%`) },
        { email: ILike(`%${kw}%`) },
        { url: ILike(`%${kw}%`) },
      ];
    }

    const page = q.page ?? 0;
    const pageSize = q.pageSize ?? 20;

    const [items, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: page * pageSize,
      take: pageSize,
    });

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Lead not found');
    return item;
  }

  async update(id: string, dto: UpdateLeadDto) {
    await this.repo.update({ id }, dto);
    return this.findOne(id);
  }

  async markSpam(id: string) {
    await this.repo.update({ id }, { status: LeadStatus.SPAM });
    return this.findOne(id);
  }

  async remove(id: string) {
    const r = await this.repo.delete({ id });
    if (!r.affected) throw new NotFoundException('Lead not found');
  }
}
