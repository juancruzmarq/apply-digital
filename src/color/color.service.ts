import { Injectable, Logger } from '@nestjs/common';
import { Color } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ColorService {
  private readonly logger = new Logger(ColorService.name);

  constructor(private readonly prisma: PrismaService) {}

  async upsertColorByName(name: string): Promise<Color> {
    try {
      const color = await this.prisma.color.upsert({
        where: { name },
        update: {},
        create: { name },
      });
      return color;
    } catch (error) {
      this.logger.error(`Error upserting color: ${name}`, error);
      throw error;
    }
  }
}
