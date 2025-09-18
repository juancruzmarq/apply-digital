import { Injectable, Logger } from '@nestjs/common';
import { Currency } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(private readonly prisma: PrismaService) {}

  async upsertCurrencyByCode(code: string): Promise<Currency> {
    this.logger.log(`Upserting currency: ${code}`);
    try {
      const currency = await this.prisma.currency.upsert({
        where: { code },
        update: {},
        create: { code },
      });
      return currency;
    } catch (error) {
      this.logger.error(`Error upserting currency: ${code}`, error);
      throw error;
    }
  }
}
