export const productMapperMock = {
  toResponse: jest.fn((p: any) => ({
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
  })),
};
