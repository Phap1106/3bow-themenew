//src/leads/dto/list-lead.dto.ts
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { LeadStatus } from '../enums';

export class ListLeadDto {
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number = 20;
}
