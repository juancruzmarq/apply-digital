import { Injectable, Logger } from '@nestjs/common';
import { Model } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ModelService {
  private readonly logger = new Logger(ModelService.name);

  constructor(private readonly prisma: PrismaService) {}

  async upsertModelByName(name: string): Promise<Model> {
    this.logger.log(`Upserting model: ${name}`);
    try {
      const model = await this.prisma.model.upsert({
        where: { name },
        update: {},
        create: { name },
      });
      return model;
    } catch (error) {
      this.logger.error(`Error upserting model: ${name}`, error);
      throw error;
    }
  }
}
