import { Injectable, Logger } from '@nestjs/common';
import { Brand } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class BrandService {
  private readonly logger = new Logger(BrandService.name);

  constructor(private readonly prisma: PrismaService) {}

  async upsertBrandByName(name: string): Promise<Brand> {
    try {
      const brand = await this.prisma.brand.upsert({
        where: { name },
        update: {},
        create: { name },
      });
      return brand;
    } catch (error) {
      this.logger.error(`Error upserting brand: ${name}`, error);
      throw error;
    }
  }
}
