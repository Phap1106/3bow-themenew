import { IsInt, Min, Max, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class ListArticlesDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt() @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt() @Min(1) @Max(100)
  limit?: number = 12;
}
