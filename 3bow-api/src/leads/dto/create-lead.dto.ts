import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength } from "class-validator";
import { BudgetRange, LeadChannel, ServiceType } from "@prisma/client";

export class CreateLeadDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsString()
  // VN phone or +country
  @Matches(/^(0|\+?\d{1,3})?[-.\s]?\d{8,12}$/, {
    message: "Số điện thoại không hợp lệ",
  })
  phone!: string;

  @IsOptional()
  @IsEmail({}, { message: "Email không hợp lệ" })
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  url?: string;

  @IsOptional()
  @IsEnum(ServiceType)
  service?: ServiceType;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  serviceText?: string;

  @IsOptional()
  @IsEnum(BudgetRange)
  budget?: BudgetRange;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;

  @IsOptional()
  @IsBoolean()
  consent?: boolean;

  // metadata từ frontend (nếu có)
  @IsOptional()
  @IsEnum(LeadChannel)
  channel?: LeadChannel;

  @IsOptional() @IsString() utmSource?: string;
  @IsOptional() @IsString() utmMedium?: string;
  @IsOptional() @IsString() utmCampaign?: string;
  @IsOptional() @IsString() utmTerm?: string;
  @IsOptional() @IsString() utmContent?: string;
  @IsOptional() @IsString() referrer?: string;
  @IsOptional() @IsString() pagePath?: string;
}
