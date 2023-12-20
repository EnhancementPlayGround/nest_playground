import { Test } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProductController } from '../../../../src/services/products/presentation/controller';
import { ProductService } from '../../../../src/services/products/application';
import { ProductRepository } from '../../../../src/services/products/infrastructure/repository';
import { Product } from '../../../../src/services/products/domain/model';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

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
        EventEmitter2,
      ],
    }).compile();

    productController = moduleRef.get<ProductController>(ProductController);
    productService = moduleRef.get<ProductService>(ProductService);
  });

  describe('retrieve test', () => {
    let productServiceRetrieveSpy: jest.SpyInstance;
    beforeEach(() => {
      productServiceRetrieveSpy = jest.spyOn(productService, 'retrieve').mockResolvedValueOnce(
        plainToClass(Product, {
          id: 'test',
          name: 'productName',
          price: 10000,
          stock: 50,
        }),
      );
    });

    test('parameter로 id를 받아서 service로 전달한다.', async () => {
      await productController.retrieve({ id: 'test' });
      expect(productServiceRetrieveSpy).toHaveBeenCalledWith({ id: 'test' });
    });

    test('parameter로 id를 받아서 Product 객체를 반환한다.', async () => {
      const result = await productController.retrieve({ id: 'test' });
      expect(result).toEqual({
        data: {
          id: 'test',
          name: 'productName',
          price: 10000,
          stock: 50,
        },
      });
    });
  });
});
