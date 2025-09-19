import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import { PercentageNonDeletedDto } from './dto/percentage-non-deleted.dto';
import { ok } from 'src/common/http/api-response.util';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Reports')
@Controller({ path: 'reports', version: '1' })
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('/')
  @ApiQuery({ name: 'withPrice', required: false, type: Boolean })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    example: '2025-01-01',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    example: '2025-01-31',
  })
  getReports(@Query() query: PercentageNonDeletedDto) {
    const reports = {
      percentageDeletedProducts:
        this.reportService.getPercentageOfDeletedProducts(),
      percentageNonDeletedProducts:
        this.reportService.getPercentageOfNonDeletedProducts(
          query.withPrice,
          query.from,
          query.to,
        ),
      outOfStockPercentage: this.reportService.getOutOfStockPercentage(),
    };

    return ok(reports, 200, 'Reports fetched');
  }

  @Get('/percentage-deleted')
  getPercentageOfDeletedProducts() {
    return ok(
      this.reportService.getPercentageOfDeletedProducts(),
      200,
      'Percentage of deleted products fetched',
    );
  }

  @Get('/percentage-non-deleted')
  @ApiQuery({ name: 'withPrice', required: false, type: Boolean })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    example: '2025-01-01',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    example: '2025-01-31',
  })
  getPercentageOfNonDeletedProducts(@Query() query: PercentageNonDeletedDto) {
    const { withPrice, from, to } = query;
    const res = this.reportService.getPercentageOfNonDeletedProducts(
      withPrice,
      from,
      to,
    );
    return ok(res, 200, 'Percentage of non-deleted products fetched');
  }

  @Get('/percentage-out-of-stock')
  getOutOfStockPercentage() {
    return ok(
      this.reportService.getOutOfStockPercentage(),
      200,
      'Out of stock percentage fetched',
    );
  }
}
