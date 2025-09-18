import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsInt({
    message: 'The number to skip must be an integer',
  })
  @Min(0, { message: 'The number to skip must be greater than or equal to 0' })
  @Transform(({ value }) =>
    value !== undefined ? parseInt(value, 10) : undefined,
  )
  skip?: number;

  @IsOptional()
  @IsInt({
    message: 'The number of items to return must be an integer',
  })
  @Min(1, {
    message: 'The number of items to return must be greater than or equal to 1',
  })
  @Max(5, {
    message: 'The number of items to return must be less than or equal to 5',
  })
  @Transform(({ value }) =>
    value !== undefined ? parseInt(value, 10) : undefined,
  )
  take?: number;
}
