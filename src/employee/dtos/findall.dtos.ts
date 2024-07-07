import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsInt, Min } from 'class-validator';

export class EmployeeFindAllQueryDto {
  @IsOptional()
  @IsString()
  q?: string = '';

  @Transform(({ value }) =>
    value !== undefined ? parseInt(value, 10) : undefined,
  )
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @Transform(({ value }) =>
    value !== undefined ? parseInt(value, 10) : undefined,
  )
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
