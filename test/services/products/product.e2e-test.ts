import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { plainToClass } from 'class-transformer';
import * as request from 'supertest';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { getConfig } from '../../../src/config';
import { HttpExceptionFilter } from '../../../src/libs/exceptions';
import { OrderModule } from '../../../src/services/orders/module';
import { ProductModule } from '../../../src/services/products/module';
import { ProductRepository } from '../../../src/services/products/infrastructure/repository';
import { Product } from '../../../src/services/products/domain/model';

describe('Product E2E test', () => {
  let app: INestApplication;
  let repository: ProductRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ProductModule,
        TypeOrmModule.forRoot(getConfig('/ormconfig')),
        EventEmitterModule.forRoot(),
        OrderModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    repository = moduleFixture.get<ProductRepository>(ProductRepository);
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('GET /products/:id', () => {
    const testProducts = [
      plainToClass(Product, {
        id: 'e2eProductTest1',
        name: 'e2eProductTest1',
        price: 5000,
        stock: 500,
      }),
      plainToClass(Product, {
        id: 'e2eProductTest2',
        name: 'e2eProductTest2',
        price: 5000,
        stock: 500,
      }),
    ];
    beforeAll(async () => {
      await repository.save({ target: testProducts });
    });

    afterAll(async () => {
      await repository.remove({ target: testProducts });
    });

    test('product Id로 상품을 조회한다.', async () => {
      return request(app.getHttpServer())
        .get('/products/e2eProductTest1')
        .expect(200)
        .expect({
          data: {
            id: 'e2eProductTest1',
            name: 'e2eProductTest1',
            price: 5000,
            stock: 500,
          },
        });
    });
  });
});
