// src/products/utils/product-query.builder.ts
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GetAllProductDto } from '../dto/getAll.dto';

@Injectable()
export class ProductQueryBuilder {
  build(dto: GetAllProductDto): { where: Prisma.ProductWhereInput } {
    const {
      name,
      brand,
      model,
      category,
      color,
      priceMin,
      priceMax,
      stockMin,
      stockMax,
      includeDeleted = false,
    } = dto;

    const where: Prisma.ProductWhereInput = {
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
      ...(brand && { brand: { name: { in: brand , mode: 'insensitive'} } }),
      ...(model && { model: { name: { in: model , mode: 'insensitive'} } }),
      ...(category && { category: { name: { in: category, mode: 'insensitive' } } }),
      ...(color && { color: { name: { in: color , mode: 'insensitive'} } }),
      
      ...(includeDeleted ? {} : { deletedAt: null }),
      ...(priceMin !== undefined || priceMax !== undefined
        ? { price: { ...(priceMin !== undefined && { gte: priceMin }),
                    ...(priceMax !== undefined && { lte: priceMax }) } }
        : {}),
      ...(stockMin !== undefined || stockMax !== undefined
        ? { stock: { ...(stockMin !== undefined && { gte: stockMin }),
                    ...(stockMax !== undefined && { lte: stockMax }) } }
        : {}),
    };

    return { where };
  }
}
