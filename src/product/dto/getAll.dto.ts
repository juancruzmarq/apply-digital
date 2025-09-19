import { Transform } from 'class-transformer';
import { IsNumberString, IsOptional } from 'class-validator';

export class GetAllProductDto {
  @IsOptional()
  brand?: string;

  @IsOptional()
  model?: string;

  @IsOptional()
  category?: string;

  @IsOptional()
  type?: string;

  @IsOptional()
  colors?: string;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseFloat(value))
  priceMin?: number;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseFloat(value))
  priceMax?: number;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value, 10))
  stockMin?: number;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value, 10))
  stockMax?: number;

  @IsOptional()
  includeDeleted?: string;
}
