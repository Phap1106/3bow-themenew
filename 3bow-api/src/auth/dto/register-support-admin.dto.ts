import { IsEmail, IsOptional, IsString, MinLength, IsDateString } from "class-validator";

export class RegisterSupportAdminDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(6) password!: string;
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsDateString() birthday?: string;
  @IsOptional() @IsString() address?: string;
}
