import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateSupportAdminDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;

  // Cho phép đổi mật khẩu
  @IsOptional() @IsString() @MinLength(6)
  password?: string;
}
