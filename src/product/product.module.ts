import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { HttpModule } from '@nestjs/axios';
import { ProductQueryBuilder } from './utils/product-query.builder';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductQueryBuilder],
})
export class ProductModule {}
