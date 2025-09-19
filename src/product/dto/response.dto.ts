import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the product',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Stock Keeping Unit, unique for each product',
    example: 'SKU12345',
    type: String,
  })
  sku: string;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Samsung Galaxy S21',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 799.99,
    type: Number,
  })
  price: number;

  @ApiProperty({
    description: 'Stock quantity available for the product',
    example: 50,
    type: Number,
  })
  stock: number;

  @ApiProperty({
    description: 'Brand of the product',
    example: 'Samsung',
    type: String,
  })
  brand: string;

  @ApiProperty({
    description: 'Category of the product',
    example: 'Smartphones',
    type: String,
  })
  category: string;

  @ApiProperty({
    description: 'Model name of the product',
    example: 'Galaxy S21',
    type: String,
  })
  model: string;

  @ApiProperty({
    description: 'Color of the product',
    example: 'Phantom Gray',
    type: String,
  })
  color: string;

  @ApiProperty({
    description: 'Currency of the product price',
    example: 'USD',
    type: String,
  })
  currency: string;

  @ApiProperty({
    description: 'Timestamp when the product was created',
    example: '2023-10-01T12:00:00Z',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the product was last updated',
    example: '2023-10-05T15:30:00Z',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;

  @ApiProperty({
    description:
      'Timestamp when the product was soft-deleted, null if not deleted',
    example: null,
    type: String,
    nullable: true,
    format: 'date-time',
  })
  deletedAt: Date | null;
}
