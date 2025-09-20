import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { ArrayOfStringValidationPipe } from '../../common/pipes/arrayOfStrings.pipe';

export class GetAllProductDto {
  @ApiPropertyOptional({
    description: 'Filter products by name',
    required: false,
    example: 'Apple Mi Watch',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter products by brand name',
    required: false,
    example: 'Samsung',
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    return new ArrayOfStringValidationPipe().transform(value);
  })
  brand?: string[];

  @ApiPropertyOptional({
    description: 'Filter products by model name',
    required: false,
    example: 'Galaxy S21',
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    return new ArrayOfStringValidationPipe().transform(value);
  })
  model?: string[];

  @ApiPropertyOptional({
    description: 'Filter products by category name',
    required: false,
    example: 'Smartphones',
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    return new ArrayOfStringValidationPipe().transform(value);
  })
  category?: string[];

  @ApiPropertyOptional({
    description: 'Filter products by type',
    required: false,
    example: 'Electronics',
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    return new ArrayOfStringValidationPipe().transform(value);
  })
  type?: string[];

  @ApiPropertyOptional({
    description: 'Filter products by color name',
    required: false,
    example: 'Black',
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    return new ArrayOfStringValidationPipe().transform(value);
  })
  color?: string[];

  @ApiPropertyOptional({
    description: 'Minimum price filter',
    required: false,
    example: 100.0,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  priceMin?: number;

  @ApiPropertyOptional({
    description: 'Maximum price filter',
    required: false,
    example: 1000.0,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  priceMax?: number;

  @ApiPropertyOptional({
    description: 'Minimum stock filter',
    required: false,
    example: 10,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  stockMin?: number;

  @ApiPropertyOptional({
    description: 'Maximum stock filter',
    required: false,
    example: 100,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  stockMax?: number;

  @ApiPropertyOptional({
    description: 'Include deleted products in the response',
    required: false,
    example: 'true',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  includeDeleted?: boolean;
}
