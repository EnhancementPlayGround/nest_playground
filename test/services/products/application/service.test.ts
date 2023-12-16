import { Test } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { ProductController } from '../../../../src/services/products/presentation/controller';
import { ProductService } from '../../../../src/services/products/application';
import { ProductRepository } from '../../../../src/services/products/infrastructure/repository';
import { Product } from '../../../../src/services/products/domain/model';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        ProductRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: jest.fn(),
            transaction: jest.fn(),
          },
        },
        EntityManager,
      ],
    }).compile();

    productService = moduleRef.get<ProductService>(ProductService);
    productRepository = moduleRef.get<ProductRepository>(ProductRepository);
  });

  describe('list test', () => {
    let productRepositoryFindSpy: jest.SpyInstance;
    beforeEach(() => {
      productRepositoryFindSpy = jest.spyOn(productRepository, 'find').mockResolvedValueOnce([
        plainToClass(Product, {
          id: 'test',
          name: 'productName',
          price: 10000,
          stock: 50,
        }),
      ]);
    });

    test('parameter로 id를 받아 repository로 전달한다.', async () => {
      await productService.retrieve({ id: 'test' });
      expect(productRepositoryFindSpy).toHaveBeenCalledWith({ ids: ['test'] });
    });

    test('parameter로 id를 받아  Product 객체를 반환한다.', async () => {
      const result = await productService.retrieve({ id: 'test' });
      expect(result).toEqual({ id: 'test', name: 'productName', price: 10000, stock: 50 });
    });
  });
});
