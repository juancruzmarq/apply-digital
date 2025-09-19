import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ProductService } from 'src/product/product.service';

@Module({
  controllers: [ReportController],
  providers: [ReportService, ProductService],
})
export class ReportModule {}
