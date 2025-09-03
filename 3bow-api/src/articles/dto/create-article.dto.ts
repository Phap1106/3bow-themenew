import { IsISO8601, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class CreateArticleDto {
  @IsString() @Length(3, 128)
  slug!: string;

  @IsString() @Length(3, 180)
  title!: string;

  @IsString() @Length(3, 300)
  excerpt!: string;

  @IsString() @Length(3, 50000)
  content!: string;

  @IsString() @Length(2, 80)
  author!: string;

  @IsOptional() @IsISO8601()
  publishedAt?: string;

  @IsUrl()
  image!: string;
}
