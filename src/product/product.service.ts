import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BrandService } from '../brand/brand.service';
import { CategoryService } from '../category/category.service';
import { ColorService } from '../color/color.service';
import { CurrencyService } from '../currency/currency.service';
import { ModelService } from '../model/model.service';
import { ExternalProductDTO } from './dto/external.dto';
import { Prisma, Product } from '@prisma/client';
import { ProductMapper } from './sync/product-mapper';
import { ProductResponseDto } from './dto/response.dto';

@Injectable()
export class ProductService {
  private readonly logger: Logger = new Logger(ProductService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly modelService: ModelService,
    private readonly brandService: BrandService,
    private readonly currencyService: CurrencyService,
    private readonly categoryService: CategoryService,
    private readonly colorService: ColorService,
    private readonly productMapper: ProductMapper,
  ) {}

  async count(where: Prisma.ProductFindManyArgs['where']): Promise<number> {
    return this.prisma.product.count({ where });
  }

  async findAll(
    where: Prisma.ProductFindManyArgs['where'],
    include?: Prisma.ProductInclude,
    skip = 0,
    take = 5,
    mapToDto = true,
  ): Promise<ProductResponseDto[] | Product[]> {
    try {
      const products = await this.prisma.product.findMany({
        where,
        include: {
          brand: true,
          category: true,
          color: true,
          model: true,
          currency: true,
          ...include,
        },
        skip,
        take,
      });
      return mapToDto
        ? products.map((p) => this.productMapper.toResponse(p))
        : products;
    } catch (error) {
      this.logger.error(`Error fetching products`, error);
      throw error;
    }
  }

  async findByIdOrSku(
    idOrSku: string,
    mapToDto = true,
    includeDeleted = false,
  ): Promise<ProductResponseDto | Product> {
    try {
      if (!idOrSku?.trim()) {
        throw new BadRequestException('Missing id or sku');
      }

      const isNumeric = /^\d+$/.test(idOrSku);
      const where: any = isNumeric ? { id: Number(idOrSku) } : { sku: idOrSku };

      if (!includeDeleted) {
        where.deletedAt = null;
      }

      const existing = await this.prisma.product.findUnique({
        where,
        include: {
          brand: true,
          category: true,
          color: true,
          currency: true,
          model: true,
        },
      });

      if (!existing) {
        throw new NotFoundException(
          `Product ${isNumeric ? 'id' : 'sku'} not found`,
        );
      }

      return mapToDto ? this.productMapper.toResponse(existing) : existing;
    } catch (error) {
      this.logger.error(`Error fetching product ${idOrSku}`, error);
      throw error;
    }
  }

  async upsertProducts(
    products: ExternalProductDTO[],
    reviveDeleted = false,
  ): Promise<void> {
    this.logger.log(`Upserting ${products.length} products...`);

    let created = 0,
      updated = 0,
      skippedDeleted = 0,
      failed = 0;

    for (const prod of products) {
      try {
        // Check if product with the same SKU exists and is deleted
        const existing = await this.prisma.product.findUnique({
          where: { sku: prod.sku },
          select: { id: true, deletedAt: true },
        });

        if (existing?.deletedAt && !reviveDeleted) {
          skippedDeleted++;
          continue;
        }

        // Upsert related entities in parallel
        const [brand, model, category, color, currency] = await Promise.all([
          this.brandService.upsertBrandByName(prod.brandName),
          this.modelService.upsertModelByName(prod.modelName),
          this.categoryService.upsertCategoryByName(prod.categoryName),
          this.colorService.upsertColorByName(prod.colorName),
          this.currencyService.upsertCurrencyByCode(prod.currencyCode),
        ]);

        // Upsert the product
        await this.prisma.product.upsert({
          where: { sku: prod.sku },
          update: {
            name: prod.name,
            price: prod.price,
            stock: prod.stock,
            brandId: brand.id,
            modelId: model.id,
            categoryId: category.id,
            colorId: color.id,
            currencyId: currency.id,
          },
          create: {
            sku: prod.sku,
            name: prod.name,
            price: prod.price,
            stock: prod.stock,
            brandId: brand.id,
            modelId: model.id,
            categoryId: category.id,
            colorId: color.id,
            currencyId: currency.id,
          },
        });

        if (existing) {
          updated++;
        } else {
          created++;
        }
      } catch (error) {
        failed++;
        this.logger.error(
          `Failed to upsert product with SKU ${prod.sku}`,
          error,
        );
      }
    }

    this.logger.log(
      `Upsert done. created=${created} updated=${updated} skippedDeleted=${skippedDeleted} failed=${failed}`,
    );

    if (failed > 0) {
      throw new Error(`${failed} products failed to upsert`);
    }

    this.logger.log('All products upserted successfully');
    return;
  }

  async softDeleteByIdOrSku(
    idOrSku: string,
    mapToDto = true,
  ): Promise<ProductResponseDto | Product> {
    try {
      const existing = await this.findByIdOrSku(idOrSku, false);

      const updated = await this.prisma.product.update({
        where: { id: existing.id },
        data: { deletedAt: new Date() },
        include: {
          brand: true,
          category: true,
          color: true,
          currency: true,
          model: true,
        },
      });

      return mapToDto ? this.productMapper.toResponse(updated) : updated;
    } catch (error) {
      this.logger.error(`Error deleting product ${idOrSku}`, error);
      throw error;
    }
  }
}
