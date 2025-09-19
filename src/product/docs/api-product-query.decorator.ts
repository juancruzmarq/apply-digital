import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiAllProductsQuery() {
  return applyDecorators(
    ApiQuery({ name: 'skip', required: false, type: Number }),
    ApiQuery({ name: 'take', required: false, type: Number }),
    ApiQuery({ name: 'brand', required: false, type: String }),
    ApiQuery({ name: 'model', required: false, type: String }),
    ApiQuery({ name: 'category', required: false, type: String }),
    ApiQuery({ name: 'type', required: false, type: String }),
    ApiQuery({
      name: 'colors',
      required: false,
      type: String,
      description: 'Comma-separated values',
    }),
    ApiQuery({ name: 'priceMin', required: false, type: Number }),
    ApiQuery({ name: 'priceMax', required: false, type: Number }),
    ApiQuery({ name: 'stockMin', required: false, type: Number }),
    ApiQuery({ name: 'stockMax', required: false, type: Number }),
  );
}
