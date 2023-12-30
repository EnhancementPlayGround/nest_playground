import { Test } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { forwardRef } from '@nestjs/common';
import { getConfig } from '@config';
import { ProductService } from '../../../../src/services/products/application';
import { ProductRepository } from '../../../../src/services/products/infrastructure/repository';
import { Product } from '../../../../src/services/products/domain/model';
import { OrderModule } from '../../../../src/services/orders/module';

describe('Product Service integration test', () => {
  let productService: ProductService;
  let productRepository: ProductRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(getConfig('/ormconfig')),
        forwardRef(() => OrderModule),
        EventEmitterModule.forRoot(),
      ],
      providers: [ProductService, ProductRepository],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<ProductRepository>(ProductRepository);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('list test', () => {
    const testProducts = [
      plainToClass(Product, {
        id: 'productTest1',
        name: 'productTest1',
        price: 1000,
        stock: 100,
      }),
      plainToClass(Product, {
        id: 'productTest2',
        name: 'productTest2',
        price: 500,
        stock: 100,
      }),
    ];
    beforeAll(async () => {
      await productRepository.save({
        target: testProducts,
      });
    });

    afterAll(async () => {
      await productRepository.remove({ target: testProducts });
    });

    test('어카운트 list를 조회한다.', async () => {
      const result = await productService.list({ ids: ['productTest1', 'productTest2'] });
      expect(result).toEqual([
        {
          id: 'productTest1',
          name: 'productTest1',
          price: 1000,
          stock: 100,
        },
        {
          id: 'productTest2',
          name: 'productTest2',
          price: 500,
          stock: 100,
        },
      ]);
    });
  });
});
