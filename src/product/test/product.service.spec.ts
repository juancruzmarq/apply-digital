import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { prismaMock } from './mocks/prisma.mock';
import {
  brandServiceMock,
  categoryServiceMock,
  colorServiceMock,
  currencyServiceMock,
  modelServiceMock,
} from './mocks/service.mock';
import { ProductMapper } from '../sync/product-mapper';
import { PrismaService } from '../../../prisma/prisma.service';
import { ModelService } from '../../model/model.service';
import { BrandService } from '../../brand/brand.service';
import { CategoryService } from '../../category/category.service';
import { ColorService } from '../../color/color.service';
import { CurrencyService } from '../../currency/currency.service';
import { productMapperMock } from './mocks/product-mapper.mock';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ExternalProductDTO } from '../dto/external.dto';

describe('ProductService', () => {
  let service: ProductService;
  const baseRows = [
    {
      id: 1,
      sku: 'SKU-1',
      name: 'Product 1',
      price: 100,
      stock: 5,
      brandId: 1,
      categoryId: 1,
      colorId: 1,
      modelId: 1,
      currencyId: 1,
      brand: { id: 1, name: 'Apple' },
      category: { id: 1, name: 'Smartwatch' },
      color: { id: 1, name: 'Gold' },
      model: { id: 1, name: 'Mi Watch' },
      currency: { id: 1, code: 'USD' },
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      id: 2,
      sku: 'SKU-2',
      name: 'Product 2',
      price: 200,
      stock: 3,
      brandId: 1,
      categoryId: 1,
      colorId: 1,
      modelId: 1,
      currencyId: 1,
      brand: { id: 1, name: 'Apple' },
      category: { id: 1, name: 'Smartwatch' },
      color: { id: 1, name: 'Gold' },
      model: { id: 1, name: 'Mi Watch' },
      currency: { id: 1, code: 'USD' },
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  ];

  beforeEach(async () => {
    jest.resetAllMocks();

    productMapperMock.toResponse.mockImplementation((p: any) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      price: p.price,
      stock: p.stock,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      deletedAt: p.deletedAt ?? null,
      brand: p.brand?.name,
      category: p.category?.name,
      color: p.color?.name,
      currency: p.currency?.code,
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: ModelService, useValue: modelServiceMock },
        { provide: BrandService, useValue: brandServiceMock },
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: ColorService, useValue: colorServiceMock },
        { provide: CurrencyService, useValue: currencyServiceMock },
        { provide: ProductMapper, useValue: productMapperMock },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('count: should return number of products', async () => {
    prismaMock.product.count.mockResolvedValue(10);
    const where = { deletedAt: null };
    const count = await service.count(where);
    expect(count).toBe(10);
    expect(prismaMock.product.count).toHaveBeenCalledTimes(1);
  });

  describe('findAll', () => {
    it('returns dtos when mapToDto=true (default)', async () => {
      prismaMock.product.findMany.mockResolvedValueOnce(baseRows);

      const where = { deletedAt: null };
      const result = await service.findAll(where, undefined, 0, 5);

      expect(prismaMock.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where,
          include: expect.objectContaining({
            brand: true,
            category: true,
            color: true,
            model: true,
            currency: true,
          }),
          skip: 0,
          take: 5,
        }),
      );

      expect(productMapperMock.toResponse).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: 1,
        name: 'Product 1',
        price: 100,
        brand: 'Apple',
        category: 'Smartwatch',
        currency: 'USD',
      });
    });

    it('returns entities when mapToDto=false', async () => {
      prismaMock.product.findMany.mockResolvedValueOnce(baseRows);

      const res = await service.findAll({}, undefined, 0, 5, false);
      expect(productMapperMock.toResponse).not.toHaveBeenCalled();
      expect(res).toEqual(baseRows);
    });

    it('returns paginated results by default', async () => {
      prismaMock.product.findMany.mockResolvedValueOnce(baseRows);

      await service.findAll({});

      expect(prismaMock.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 5,
        }),
      );
    });
  });

  describe('findByIdOrSku', () => {
    it('should throw BadRequestException if idOrSku is missing', async () => {
      try {
        await expect(service.findByIdOrSku('')).rejects.toThrow(
          'Missing id or sku',
        );
        expect(prismaMock.product.findUnique).not.toHaveBeenCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should find by numeric ID when idOrSku is numeric string', async () => {
      prismaMock.product.findUnique.mockResolvedValueOnce(baseRows[0]);

      const result = await service.findByIdOrSku('1');
      expect(prismaMock.product.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1, deletedAt: null },
          include: expect.objectContaining({
            brand: true,
            category: true,
            color: true,
            currency: true,
            model: true,
          }),
        }),
      );
      expect(productMapperMock.toResponse).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({ id: 1, name: 'Product 1' });
    });

    it('should find by SKU when idOrSku is non-numeric string', async () => {
      prismaMock.product.findUnique.mockResolvedValueOnce(baseRows[1]);
      const result = await service.findByIdOrSku('SKU-2');
      expect(prismaMock.product.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { sku: 'SKU-2', deletedAt: null },
          include: expect.objectContaining({
            brand: true,
            category: true,
            color: true,
            currency: true,
            model: true,
          }),
        }),
      );
      expect(productMapperMock.toResponse).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({ id: 2, name: 'Product 2' });
    });

    it('should throw NotFoundException if product not found', async () => {
      try {
        prismaMock.product.findUnique.mockResolvedValueOnce(null);
        await expect(service.findByIdOrSku('999')).rejects.toThrow(
          'Product id not found',
        );
        expect(prismaMock.product.findUnique).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('upsertProduct', () => {
    it('should create a new product if it does not exist', async () => {
      const dto: ExternalProductDTO[] = [
        {
          sku: 'SKU-3',
          name: 'Product 3',
          price: 300,
          stock: 10,
          brandName: 'Apple',
          categoryName: 'Smartwatch',
          colorName: 'Gold',
          modelName: 'Mi Watch',
          currencyCode: 'USD',
        },
      ];
      prismaMock.product.findUnique.mockResolvedValueOnce(null);
      modelServiceMock.upsertModelByName.mockResolvedValueOnce({
        id: 1,
        name: 'Mi Watch',
      } as any);
      brandServiceMock.upsertBrandByName.mockResolvedValueOnce({
        id: 1,
        name: 'Apple',
      } as any);
      categoryServiceMock.upsertCategoryByName.mockResolvedValueOnce({
        id: 1,
        name: 'Smartwatch',
      } as any);
      colorServiceMock.upsertColorByName.mockResolvedValueOnce({
        id: 1,
        name: 'Gold',
      } as any);
      currencyServiceMock.upsertCurrencyByCode.mockResolvedValueOnce({
        id: 1,
        code: 'USD',
      } as any);
      prismaMock.product.create.mockResolvedValueOnce({
        id: 3,
        sku: 'SKU-3',
        name: 'Product 3',
        price: 300,
        stock: 10,
        brandId: 1,
        categoryId: 1,
        colorId: 1,
        modelId: 1,
        currencyId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        brand: { id: 1, name: 'Apple' },
        category: { id: 1, name: 'Smartwatch' },
        color: { id: 1, name: 'Gold' },
        model: { id: 1, name: 'Mi Watch' },
        currency: { id: 1, code: 'USD' },
      } as any);
      const result = await service.upsertProducts(dto);
      expect(prismaMock.product.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { sku: 'SKU-3' } }),
      );
      expect(modelServiceMock.upsertModelByName).toHaveBeenCalledWith(
        'Mi Watch',
      );
      expect(brandServiceMock.upsertBrandByName).toHaveBeenCalledWith('Apple');
      expect(categoryServiceMock.upsertCategoryByName).toHaveBeenCalledWith(
        'Smartwatch',
      );
      expect(colorServiceMock.upsertColorByName).toHaveBeenCalledWith('Gold');
      expect(currencyServiceMock.upsertCurrencyByCode).toHaveBeenCalledWith(
        'USD',
      );
      expect(prismaMock.product.upsert).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });
  });

  describe('softDeleteByIdOrSku', () => {
    it('should throw BadRequestException if idOrSku is missing', async () => {
      try {
        await expect(service.softDeleteByIdOrSku('')).rejects.toThrow(
          'Missing id or sku',
        );
        expect(prismaMock.product.findUnique).not.toHaveBeenCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should soft delete by numeric ID when idOrSku is numeric string', async () => {
      const row = { ...baseRows[0], deletedAt: null };
      prismaMock.product.findUnique.mockResolvedValueOnce(row);
      prismaMock.product.update.mockResolvedValueOnce({
        ...row,
        deletedAt: new Date(),
      } as any);
      const result = await service.softDeleteByIdOrSku('1');
      expect(prismaMock.product.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1, deletedAt: null },
          include: expect.objectContaining({
            brand: true,
            category: true,
            color: true,
            currency: true,
            model: true,
          }),
        }),
      );
      expect(prismaMock.product.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          data: { deletedAt: expect.any(Date) },
          include: expect.objectContaining({
            brand: true,
            category: true,
            color: true,
            currency: true,
            model: true,
          }),
        }),
      );
      expect(productMapperMock.toResponse).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        id: 1,
        name: 'Product 1',
        deletedAt: expect.any(Date),
      });
    });
    it('should soft delete by SKU when idOrSku is non-numeric string', async () => {
      const row = { ...baseRows[1], deletedAt: null };
      prismaMock.product.findUnique.mockResolvedValueOnce(row);
      prismaMock.product.update.mockResolvedValueOnce({
        ...row,
        deletedAt: new Date(),
      } as any);
      const result = await service.softDeleteByIdOrSku('SKU-2');
      expect(prismaMock.product.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { sku: 'SKU-2', deletedAt: null },
          include: expect.objectContaining({
            brand: true,
            category: true,
            color: true,
            currency: true,
            model: true,
          }),
        }),
      );
      expect(prismaMock.product.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 2 },
          data: { deletedAt: expect.any(Date) },
          include: expect.objectContaining({
            brand: true,
            category: true,
            color: true,
            currency: true,
            model: true,
          }),
        }),
      );
      expect(productMapperMock.toResponse).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        id: 2,
        name: 'Product 2',
        deletedAt: expect.any(Date),
      });
    });
  });
});
