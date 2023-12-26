import { Test } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { forwardRef } from '@nestjs/common';
import { getConfig } from '../../../../src/config';
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
    beforeAll(async () => {
      await productRepository.save({
        target: [
          plainToClass(Product, {
            id: 'test1',
            name: 'product1',
            price: 1000,
            stock: 100,
          }),
          plainToClass(Product, {
            id: 'test2',
            name: 'product2',
            price: 500,
            stock: 100,
          }),
        ],
      });
    });

    afterAll(async () => {
      await productRepository.truncate();
    });

    test('어카운트 list를 조회한다.', async () => {
      const result = await productService.list({ ids: ['test1', 'test2'] });
      expect(result).toEqual([
        {
          id: 'test1',
          name: 'product1',
          price: 1000,
          stock: 100,
        },
        {
          id: 'test2',
          name: 'product2',
          price: 500,
          stock: 100,
        },
      ]);
    });
  });
});
