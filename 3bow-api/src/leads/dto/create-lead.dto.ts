import { Transform } from 'class-transformer';
import {
  IsBoolean, IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength,
} from 'class-validator';
import { BudgetRange, LeadChannel, ServiceType } from '../enums';
import { mapBudget, mapService } from '../mappers';

const normPhone = (s: any) =>
  String(s ?? '')
    .replace(/[^\d+]/g, '')
    .slice(0, 20);

const toBool = (v: any) =>
  v === true || v === 'true' || v === 1 || v === '1';

export class CreateLeadDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @Transform(({ value }) => normPhone(value))
  @Matches(/^(0|\+?\d{1,3})?[-.\s]?\d{8,12}$/, { message: 'Số điện thoại không hợp lệ' })
  phone!: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  url?: string;

  /** Map từ: service (token FE), hoặc serviceText (VN) */
  @IsOptional()
  @Transform(({ value, obj }) => mapService(value ?? obj?.serviceText))
  @IsEnum(ServiceType)
  service?: ServiceType;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  serviceText?: string;

  /** Map từ: budget (token FE), hoặc budgetLabel (VN), hoặc số tiền (VNĐ) */
  @IsOptional()
  @Transform(({ value, obj }) => mapBudget(value ?? obj?.budgetLabel ?? obj?.budget))
  @IsEnum(BudgetRange)
  budget?: BudgetRange;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;

  /** checkbox → boolean chuẩn */
  @IsOptional()
  @Transform(({ value }) => toBool(value))
  @IsBoolean()
  consent?: boolean;

  /** Mặc định WEBSITE nếu không gửi */
  @IsOptional()
  @Transform(({ value }) => (value ?? LeadChannel.WEBSITE))
  @IsEnum(LeadChannel)
  channel?: LeadChannel;

  // UTM + meta
  @IsOptional() @IsString() utmSource?: string;
  @IsOptional() @IsString() utmMedium?: string;
  @IsOptional() @IsString() utmCampaign?: string;
  @IsOptional() @IsString() utmTerm?: string;
  @IsOptional() @IsString() utmContent?: string;
  @IsOptional() @IsString() referrer?: string;
  @IsOptional() @IsString() pagePath?: string;
}
