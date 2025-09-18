import { Injectable, Logger } from '@nestjs/common';
import { ProductService } from '../product.service';
import { Cron } from '@nestjs/schedule';
import { ProductFetcher } from './product-fetcher';
import { ProductMapper } from './product-mapper';

// 1 HOUR INTERVAL
const INTERVAL = '0 * * * *'; // Every hour

@Injectable()
export class ProductSyncJob {
  private readonly logger: Logger = new Logger(ProductSyncJob.name);
  constructor(
    private readonly productService: ProductService,
    private readonly fetcherService: ProductFetcher,
    private readonly productMapper: ProductMapper,
  ) {}

  @Cron(INTERVAL)
  async syncProducts() {
    this.logger.log('Starting product synchronization job');

    try {
      const response = await this.fetcherService.fetchProducts();
      this.logger.log(`Fetched ${response.items.length} products`);

      const products = this.productMapper.mapResponse(response);

      await this.productService.upsertProducts(products);

      this.logger.log('Product synchronization job completed successfully');
    } catch (error) {
      this.logger.error('Error during product synchronization job', error);
    }
  }
}
