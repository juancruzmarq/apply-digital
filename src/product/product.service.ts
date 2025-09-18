import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { BrandService } from 'src/brand/brand.service';
import { CategoryService } from 'src/category/category.service';
import { ColorService } from 'src/color/color.service';
import { CurrencyService } from 'src/currency/currency.service';
import { ModelService } from 'src/model/model.service';
import { ExternalProductDTO } from './dto/external.dto';
import { Prisma, Product } from '@prisma/client';

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
  ) {}

  async count(where: Prisma.ProductFindManyArgs['where']): Promise<number> {
    return this.prisma.product.count({ where });
  }

  async findAll(
    where: Prisma.ProductFindManyArgs['where'],
    include?: Prisma.ProductInclude,
    skip = 0,
    take = 5,
  ): Promise<Product[] | []> {
    return this.prisma.product.findMany({
      where,
      include,
      skip,
      take,
    });
  }

  async findOne(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { sku },
    });
  }

  async upsertProducts(products: ExternalProductDTO[], reviveDeleted = false) {
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
  }
}
