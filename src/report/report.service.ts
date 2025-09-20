import { Injectable, Logger } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import {
  OutOfStockPercentageResponseDto,
  PercentageDeletedResponseDto,
  PercentageNonDeletedResponseDto,
} from './dto/response.dto';

@Injectable()
export class ReportService {
  private readonly logger: Logger = new Logger(ReportService.name);
  constructor(private readonly productService: ProductService) {}

  async getPercentageOfDeletedProducts(): Promise<PercentageDeletedResponseDto> {
    this.logger.log('Calculating percentage of deleted products');
    try {
      // Get total products and deleted products in parallel
      const [total, deleted] = await Promise.all([
        this.productService.count({}),
        this.productService.count({ deletedAt: { not: null } }),
      ]);
      return {
        name: 'Deleted Products Percentage',
        description: 'Percentage of deleted products',
        percentage: total ? Math.round((deleted / total) * 100 * 100) / 100 : 0,
      };
    } catch (error) {
      this.logger.error(
        'Error calculating percentage of deleted products',
        error,
      );
      throw error;
    }
  }

  async getPercentageOfNonDeletedProducts(
    withPrice?: boolean,
    from?: Date,
    to?: Date,
  ): Promise<PercentageNonDeletedResponseDto> {
    this.logger.log(
      `Calculating percentage of non-deleted products withPrice=${withPrice} from=${from?.toISOString()} to=${to?.toISOString()}`,
    );
    try {
      // Get total non-deleted products and those matching the criteria in parallel
      const [totalNonDeleted, windowNonDeleted] = await Promise.all([
        this.productService.count({ deletedAt: null }),
        this.productService.count({
          deletedAt: null,
          price: withPrice ? { gt: 0 } : undefined,
          createdAt: from && to ? { gte: from, lt: to } : undefined,
        }),
      ]);

      // Calculate the percentage
      const percentage = !totalNonDeleted
        ? 0
        : Math.round((windowNonDeleted / totalNonDeleted) * 100 * 100) / 100;

      return {
        name: 'Non-Deleted Products Percentage',
        description: 'Percentage of non-deleted products',
        percentage,
      };
    } catch (error) {
      this.logger.error(
        'Error calculating percentage of non-deleted products',
        error,
      );
      throw error;
    }
  }

  async getOutOfStockPercentage(): Promise<OutOfStockPercentageResponseDto> {
    try {
      // Get total non-deleted products and out-of-stock products in parallel
      const [total, out] = await Promise.all([
        this.productService.count({ deletedAt: null }),
        this.productService.count({ deletedAt: null, stock: { equals: 0 } }),
      ]);
      return {
        name: 'Out of Stock Percentage',
        description: 'Percentage of products that are out of stock',
        percentage: total ? Math.round((out / total) * 100 * 100) / 100 : 0,
      };
    } catch (error) {
      this.logger.error('Error calculating out-of-stock percentage', error);
      throw error;
    }
  }
}
