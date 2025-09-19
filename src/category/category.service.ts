import { Injectable, Logger } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
  constructor(private readonly prisma: PrismaService) {}

  async upsertCategoryByName(name: string): Promise<Category> {
    try {
      const category = await this.prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      });
      return category;
    } catch (error) {
      this.logger.error(`Error upserting category: ${name}`, error);
      throw error;
    }
  }
}
