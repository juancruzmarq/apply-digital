// src/products/utils/product-query.builder.ts
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GetAllProductDto } from '../dto/getAll.dto';

@Injectable()
export class ProductQueryBuilder {
  build(dto: GetAllProductDto): { where: Prisma.ProductWhereInput } {
    const {
      brand,
      model,
      category,
      type,
      colors,
      priceMin,
      priceMax,
      stockMin,
      stockMax,
    } = dto;

    const where: Prisma.ProductWhereInput = {
      ...(brand && { brand: { name: brand } }),
      ...(model && { model: { name: model } }),
      ...(category && { category: { name: category } }),
      ...(type && { type: { name: type } }),
      ...(colors && { color: { name: { in: colors.split(',') } } }),

      ...(priceMin !== undefined || priceMax !== undefined
        ? {
            price: {
              ...(priceMin !== undefined && { gte: priceMin }),
              ...(priceMax !== undefined && { lte: priceMax }),
            },
          }
        : {}),

      ...(stockMin !== undefined || stockMax !== undefined
        ? {
            stock: {
              ...(stockMin !== undefined && { gte: stockMin }),
              ...(stockMax !== undefined && { lte: stockMax }),
            },
          }
        : {}),
    };

    return { where };
  }
}
