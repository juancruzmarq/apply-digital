import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';
import { GetAllProductDto } from './dto/getAll.dto';
import { ProductService } from './product.service';
import { paginated } from 'src/common/http/api-response.util';
import { ProductQueryBuilder } from './utils/product-query.builder';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productQueryBuilder: ProductQueryBuilder,
  ) {}

  @Get('/')
  async findAll(
    @Query() pagination: PaginationQueryDto,
    @Query() query: GetAllProductDto,
  ) {
    const { skip = 0, take = 5 } = pagination;

    const { where } = this.productQueryBuilder.build(query);

    const total = await this.productService.count(where);
    const items = await this.productService.findAll(
      where,
      undefined,
      skip,
      take,
    );

    return paginated(items, total, skip, take, 'Products fetched');
  }

  @Get('/:id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.productService.findOne(id);
  }

  @Get('/sku/:sku')
  findBySku(@Param('sku') sku: string) {
    return this.productService.findBySku(sku);
  }
}
