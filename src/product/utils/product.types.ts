import { Prisma } from '@prisma/client';

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { brand: true; category: true; color: true; currency: true };
}>;
