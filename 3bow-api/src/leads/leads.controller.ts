// src/leads/leads.controller.ts
import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, HttpCode, ParseUUIDPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ListLeadDto } from './dto/list-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  async create(@Body() dto: CreateLeadDto, @Req() req: Request) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress || undefined;
    const userAgent = req.headers['user-agent'];
    return this.leadsService.create(dto, { ip, userAgent });
  }

  @Get()
  async findAll(@Query() q: ListLeadDto) {
    return this.leadsService.findAll(q);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateLeadDto) {
    return this.leadsService.update(id, dto);
  }

  @Patch(':id/spam')
  async markSpam(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.leadsService.markSpam(id);
  }

 @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.leadsService.remove(id);
  }

  /** ✅ Fallback: POST /:id/delete (cũng bỏ ParseUUIDPipe) */
  @Post(':id/delete')
  async removeCompat(@Param('id') id: string) {
    await this.leadsService.remove(id);
    return { ok: true };
  }
}
