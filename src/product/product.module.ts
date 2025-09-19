import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { HttpModule } from '@nestjs/axios';
import { ProductQueryBuilder } from './utils/product-query.builder';
import { ModelService } from 'src/model/model.service';
import { CategoryService } from 'src/category/category.service';
import { CurrencyService } from 'src/currency/currency.service';
import { BrandService } from 'src/brand/brand.service';
import { ColorService } from 'src/color/color.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductSyncJob } from './sync/product-sync.job';
import { ProductFetcher } from './sync/product-fetcher';
import { ProductMapper } from './sync/product-mapper';

@Module({
  imports: [
    ScheduleModule.forRoot(),

    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductQueryBuilder,
    ModelService,
    CategoryService,
    CurrencyService,
    BrandService,
    ColorService,
    ProductSyncJob,
    ProductFetcher,
    ProductMapper,
  ],
  exports: [ProductService],
})
export class ProductModule {}
