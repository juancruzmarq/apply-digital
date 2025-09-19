import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsISO8601, IsOptional } from 'class-validator';

export class PercentageNonDeletedDto {
  @ApiPropertyOptional({ type: Boolean, description: 'Filtrar solo price > 0' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  withPrice?: boolean;

  // Accept ISO 8601 date strings and convert to Date
  @ApiPropertyOptional({ type: String, example: '2025-01-01' })
  @IsOptional()
  @IsISO8601({ strict: true })
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  from?: Date;

  @ApiPropertyOptional({
    type: String,
    example: '2025-01-31',
    description: 'Exclusive',
  })
  @IsOptional()
  @IsISO8601({ strict: true })
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  to?: Date;
}
