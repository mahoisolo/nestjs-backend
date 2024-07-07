import { IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllQueryDto {
  @IsOptional()
  @IsBoolean()
  flat?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  depth?: number;
}

export class PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;
}
