import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiAllProductsQuery() {
  return applyDecorators(
    ApiQuery({ name: 'skip', required: false, type: Number, description: 'Number of items to skip, default is 0' }),
    ApiQuery({ name: 'take', required: false, type: Number, description: 'Number of items to take, default is 5' }),
    ApiQuery({ name: 'brand', required: false, type: String, description: 'Comma-separated values' }),
    ApiQuery({ name: 'model', required: false, type: String, description: 'Comma-separated values' }),
    ApiQuery({ name: 'category', required: false, type: String, description: 'Comma-separated values'}),
    ApiQuery({ name: 'name', required: false, type: String }),
    ApiQuery({
      name: 'color',
      required: false,
      type: String,
      description: 'Comma-separated values',
    }),
    ApiQuery({ name: 'priceMin', required: false, type: Number, description: 'Minimum price filter' }),
    ApiQuery({ name: 'priceMax', required: false, type: Number, description: 'Maximum price filter' }),
    ApiQuery({ name: 'stockMin', required: false, type: Number, description: 'Minimum stock filter' }),
    ApiQuery({ name: 'stockMax', required: false, type: Number, description: 'Maximum stock filter' }),
  );
}
