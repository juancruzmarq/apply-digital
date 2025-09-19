import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumberString, IsOptional } from 'class-validator';

export class GetAllProductDto {
  @ApiPropertyOptional({
    description: 'Filter products by brand name',
    required: false,
    example: 'Samsung',
  })
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({
    description: 'Filter products by model name',
    required: false,
    example: 'Galaxy S21',
  })
  @IsOptional()
  model?: string;

  @ApiPropertyOptional({
    description: 'Filter products by category name',
    required: false,
    example: 'Smartphones',
  })
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'Filter products by type',
    required: false,
    example: 'Electronics',
  })
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({
    description: 'Filter products by color name',
    required: false,
    example: 'Black',
  })
  @IsOptional()
  colors?: string;

  @ApiPropertyOptional({
    description: 'Minimum price filter',
    required: false,
    example: 100.0,
    type: Number,
  })
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseFloat(value))
  priceMin?: number;

  @ApiPropertyOptional({
    description: 'Maximum price filter',
    required: false,
    example: 1000.0,
    type: Number,
  })
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseFloat(value))
  priceMax?: number;

  @ApiPropertyOptional({
    description: 'Minimum stock filter',
    required: false,
    example: 10,
    type: Number,
  })
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value, 10))
  stockMin?: number;

  @ApiPropertyOptional({
    description: 'Maximum stock filter',
    required: false,
    example: 100,
    type: Number,
  })
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value, 10))
  stockMax?: number;

  @ApiPropertyOptional({
    description: 'Include deleted products in the response',
    required: false,
    example: 'true',
  })
  @IsOptional()
  includeDeleted?: string;
}
