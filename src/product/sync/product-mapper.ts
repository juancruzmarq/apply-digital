import { Injectable, Logger } from '@nestjs/common';
import type {
  ExternalAPIResponse,
  Item,
} from '../../common/types/response.types';
import { ExternalProductDTO } from '../dto/external.dto';
import { ProductResponseDto } from '../dto/response.dto';
import { ProductWithRelations } from '../utils/product.types';

@Injectable()
export class ProductMapper {
  private readonly logger: Logger = new Logger(ProductMapper.name);
  constructor() {}
  private titleCase(s: string) {
    return s
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  private normName(s?: string) {
    if (!s) return '';
    return this.titleCase(s);
  }

  private normCurrency(code?: string) {
    return (code ?? '').trim().toUpperCase();
  }

  private toInt(n: unknown, fallback = 0) {
    const v = Number(n);
    return Number.isFinite(v) ? Math.trunc(v) : fallback;
  }

  private toFloat(n: unknown, fallback = 0) {
    const v = Number(n);
    return Number.isFinite(v) ? v : fallback;
  }

  mapItem(item: Item): ExternalProductDTO {
    const f = item.fields;

    return {
      sku: f.sku.trim(),
      name: f.name.trim(),
      price: this.toFloat(f.price, 0),
      stock: Math.max(0, this.toInt(f.stock, 0)),
      brandName: this.normName(f.brand),
      modelName: this.normName(f.model),
      categoryName: this.normName(f.category),
      colorName: this.normName(f.color),
      currencyCode: this.normCurrency(f.currency),
    };
  }

  mapArray(items: Item[]): ExternalProductDTO[] {
    const dtos: ExternalProductDTO[] = [];
    for (const it of items) {
      try {
        dtos.push(this.mapItem(it));
      } catch {
        this.logger.warn(`Skipping invalid item with ID ${it.sys.id}`);
      }
    }
    return dtos;
  }

  mapResponse(resp: ExternalAPIResponse): ExternalProductDTO[] {
    return this.mapArray(resp.items ?? []);
  }

  toResponse(product: ProductWithRelations): ProductResponseDto {
    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      stock: product.stock,
      brand: product.brand.name,
      category: product.category.name,
      model: product.model.name,
      color: product.color.name,
      currency: product.currency.code,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      deletedAt: product.deletedAt,
    };
  }
}
