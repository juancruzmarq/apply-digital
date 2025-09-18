import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { ModelModule } from './model/model.module';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { ColorModule } from './color/color.module';
import { CurrencyModule } from './currency/currency.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ProductModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ModelModule,
    BrandModule,
    CategoryModule,
    ColorModule,
    CurrencyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
