export class ProductResponseDto {
  id: number;
  sku: string;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  brand: string;
  category: string;
  color: string;
  currency: string;
}
