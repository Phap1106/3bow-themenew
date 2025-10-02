import { IsOptional, IsString, MinLength } from 'class-validator';
import { IsImageSizeValid, IsValidImageFormat } from '../../common/validators/image-size.validator';

export class UpdateProfileDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;
  
  @IsOptional() 
  @IsString() 
  @IsValidImageFormat({ message: 'Ảnh phải là URL hợp lệ hoặc base64 image (jpeg, jpg, png, gif, webp)' })
  @IsImageSizeValid(2, { message: 'Kích thước ảnh không được vượt quá 2MB' })
  img?: string;
  
  @IsOptional() @IsString() @MinLength(6) password?: string;
}
