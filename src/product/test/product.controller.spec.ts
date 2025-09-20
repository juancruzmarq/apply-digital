import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { ProductResponseDto } from '../dto/response.dto';
import { ProductService } from '../product.service';
import { ProductQueryBuilder } from '../utils/product-query.builder';
import { ProductSyncJob } from '../sync/product-sync.job';

describe('ProductController', () => {
  let controller: ProductController;

  const productServiceMock = {
    count: jest.fn(),
    findAll: jest.fn(),
    findByIdOrSku: jest.fn(),
    softDeleteByIdOrSku: jest.fn(),
  };

  const productQueryBuilderMock = {
    build: jest.fn(),
  };

  const productSyncJobMock = {
    syncProducts: jest.fn(),
  };

  const items: ProductResponseDto[] = [
    {
      id: 1,
      sku: 'SKU-1',
      name: 'Product 1',
      price: 100,
      stock: 5,
      model: 'Model X',
      createdAt: new Date('2025-01-01T00:00:00Z') as unknown as any,
      updatedAt: new Date('2025-01-02T00:00:00Z') as unknown as any,
      deletedAt: null,
      brand: 'Apple',
      category: 'Smartwatch',
      color: 'Gold',
      currency: 'USD',
    },
    {
      id: 2,
      sku: 'SKU-2',
      name: 'Product 2',
      price: 200,
      stock: 3,
      model: 'Model Y',
      createdAt: new Date('2025-01-03T00:00:00Z') as unknown as any,
      updatedAt: new Date('2025-01-04T00:00:00Z') as unknown as any,
      deletedAt: null,
      brand: 'Apple',
      category: 'Smartwatch',
      color: 'Gold',
      currency: 'USD',
    },
  ];

  beforeEach(async () => {
    jest.resetAllMocks();

    productQueryBuilderMock.build.mockReturnValue({
      where: { deletedAt: null },
    });

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: ProductQueryBuilder, useValue: productQueryBuilderMock },
        { provide: ProductSyncJob, useValue: productSyncJobMock },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /products', () => {
    it('returns paginated products with provided skip/take', async () => {
      productServiceMock.count.mockResolvedValue(12);
      productServiceMock.findAll.mockResolvedValue(items);

      const pagination = { skip: 2, take: 5 }; 
      const query = { brand: 'Apple' } as any;

      const res = await controller.findAll(pagination as any, query);

      expect(productQueryBuilderMock.build).toHaveBeenCalledWith(query);

      expect(productServiceMock.count).toHaveBeenCalledWith({
        deletedAt: null,
      });
      expect(productServiceMock.findAll).toHaveBeenCalledWith(
        { deletedAt: null },
        undefined,
        2,
        5,
      );

      expect(res.ok).toBe(true);
      expect(res.statusCode).toBe(200);
      expect(res.message).toBe('Products fetched');
      expect(res.data).toEqual(items);
      expect(res.meta).toEqual({
        total: 12,
        skip: 2,
        take: 5,
        count: 2,
        hasMore: 12 > 2 + 2, // true
      });
      expect(typeof res.timestamp).toBe('string');
    });

    it('uses default pagination when skip/take are not provided', async () => {
      productServiceMock.count.mockResolvedValue(2);
      productServiceMock.findAll.mockResolvedValue(items);

      const res = await controller.findAll({} as any, {} as any);

      expect(productServiceMock.findAll).toHaveBeenCalledWith(
        { deletedAt: null },
        undefined,
        0,
        5,
      );

      expect(res.meta).toEqual({
        total: 2,
        skip: 0,
        take: 5,
        count: 2,
        hasMore: 2 > 0 + 2, // false
      });
    });
  });

  describe('GET /products/:idOrSku', () => {
    it('returns product and parses includeDeleted=true', async () => {
      productServiceMock.findByIdOrSku.mockResolvedValue(items[0]);

      const res = await controller.findOne('SKU-1', 'true');

      expect(productServiceMock.findByIdOrSku).toHaveBeenCalledWith(
        'SKU-1',
        true,
        true,
      );
      expect(res.ok).toBe(true);
      expect(res.data).toEqual(items[0]);
      expect(res.message).toBe('Product fetched');
    });

    it('returns product and parses includeDeleted=false (default)', async () => {
      productServiceMock.findByIdOrSku.mockResolvedValue(items[1]);

      const res = await controller.findOne('2', undefined);

      expect(productServiceMock.findByIdOrSku).toHaveBeenCalledWith(
        '2',
        true,
        false,
      );
      expect(res.data).toEqual(items[1]);
    });
  });

  describe('POST /products/sync', () => {
    it('triggers sync job and returns ok', async () => {
      productSyncJobMock.syncProducts.mockResolvedValue(undefined);

      const res = await controller.sync();

      expect(productSyncJobMock.syncProducts).toHaveBeenCalledTimes(1);
      expect(res.ok).toBe(true);
      expect(res.message).toBe('Product synchronization triggered');
      expect(res.data).toBeNull();
    });
  });

  describe('DELETE /products/:idOrSku', () => {
    it('soft-deletes by idOrSku and wraps response', async () => {
      productServiceMock.softDeleteByIdOrSku.mockResolvedValue({
        ...items[0],
        deletedAt: new Date(),
      });

      const res = await controller.delete('1');

      expect(productServiceMock.softDeleteByIdOrSku).toHaveBeenCalledWith('1');
      expect(res.ok).toBe(true);
      expect(res.message).toBe('Product deleted');
      expect(res.data).toMatchObject({ id: 1, deletedAt: expect.any(Date) });
    });
  });
});
