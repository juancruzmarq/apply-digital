import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { ModelModule } from './model/model.module';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { ColorModule } from './color/color.module';
import { CurrencyModule } from './currency/currency.module';
import { PrismaModule } from 'prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ReportModule } from './report/report.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ProductModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ModelModule,
    BrandModule,
    CategoryModule,
    ColorModule,
    CurrencyModule,
    PrismaModule,
    ReportModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
