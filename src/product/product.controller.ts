import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { GetAllProductDto } from './dto/getAll.dto';
import { ProductService } from './product.service';
import { ok, paginated } from '../common/http/api-response.util';
import { ProductQueryBuilder } from './utils/product-query.builder';
import { ProductResponseDto } from './dto/response.dto';
import { ApiAllProductsQuery } from './docs/api-product-query.decorator';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { ProductSyncJob } from './sync/product-sync.job';

@Public()
@ApiTags('Products')
@Controller({ path: 'products', version: '1' })
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productQueryBuilder: ProductQueryBuilder,
    private readonly productSyncService: ProductSyncJob,
  ) {}

  @Get('/')
  @ApiAllProductsQuery()
  async findAll(
    @Query() pagination: PaginationQueryDto,
    @Query() query: GetAllProductDto,
  ) {
    const { skip = 0, take = 5 } = pagination;

    const { where } = this.productQueryBuilder.build(query);

    const total = await this.productService.count(where);
    const items = (await this.productService.findAll(
      where,
      undefined,
      skip,
      take,
    )) as ProductResponseDto[];

    return paginated(items, total, skip, take, 'Products fetched');
  }

  @Get('/:idOrSku')
  @ApiResponse({
    status: 200,
    description: 'Product found',
    type: ProductResponseDto,
  })
  @ApiParam({
    name: 'idOrSku',
    required: true,
    description: 'Product numeric ID or SKU',
    schema: {
      oneOf: [
        { type: 'integer', example: 123 },
        { type: 'string', example: 'ZIMPDOPD' },
      ],
    },
  })
  @ApiQuery({
    name: 'includeDeleted',
    required: false,
    type: Boolean,
    description: 'Whether to include soft-deleted products',
  })
  async findOne(
    @Param('idOrSku') idOrSku: string,
    @Query('includeDeleted') includeDeleted?: string,
  ) {
    const result = await this.productService.findByIdOrSku(
      idOrSku,
      true,
      includeDeleted === 'true',
    );
    return ok(result, 200, 'Product fetched');
  }

  @Post('/sync')
  @ApiResponse({
    status: 200,
    description: 'Endpoint to manually trigger product synchronization',
  })
  async sync() {
    await this.productSyncService.syncProducts();
    return ok(null, 200, 'Product synchronization triggered');
  }

  @Delete(':idOrSku')
  @ApiParam({
    name: 'idOrSku',
    required: true,
    description: 'Product numeric ID or SKU',
    schema: {
      oneOf: [
        { type: 'integer', example: 123 },
        { type: 'string', example: 'ZIMPDOPD' },
      ],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted',
    type: ProductResponseDto,
  })
  async delete(@Param('idOrSku') idOrSku: string) {
    const result = await this.productService.softDeleteByIdOrSku(idOrSku);
    return ok(result, 200, 'Product deleted');
  }
}
