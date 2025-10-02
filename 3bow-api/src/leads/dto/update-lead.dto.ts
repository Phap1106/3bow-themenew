//src/leads/dto/update-lead.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LeadStatus } from '../enums';

export class UpdateLeadDto {
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @IsOptional()
  @IsString()
  assignedToId?: string; // id User nội bộ
}
