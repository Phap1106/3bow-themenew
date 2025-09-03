// import { IsOptional, IsString, MinLength ,IsDateString} from 'class-validator';

// export class UpdateSupportAdminDto {
//   @IsString() @MinLength(6) password!: string;
//   @IsOptional() @IsString() firstName?: string;
//   @IsOptional() @IsString() lastName?: string;
//   @IsOptional() @IsString() phone?: string;
//   @IsOptional() @IsDateString() birthday?: string;
//   @IsOptional() @IsString() address?: string;
// }


// src/auth/dto/update-support-admin.dto.ts
import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateSupportAdminDto {
  @IsOptional() @IsString() @MaxLength(50)
  firstName?: string;

  @IsOptional() @IsString() @MaxLength(50)
  lastName?: string;

  @IsOptional() @IsString() @MaxLength(20)
  phone?: string;

  @IsOptional() @IsString() @MaxLength(255)
  address?: string;
  // KHÔNG có email ở DTO => không thể sửa email
}
