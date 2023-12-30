import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { plainToClass } from 'class-transformer';
import * as request from 'supertest';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { getConfig } from '@config';
import { HttpExceptionFilter } from '@libs/exceptions';
import { ProductModule } from '../../../src/services/products/module';
import { OrderModule } from '../../../src/services/orders/module';
import { OrderProductLogModule } from '../../../src/services/order-product-logs/module';
import { ProductRepository } from '../../../src/services/products/infrastructure/repository';
import { OrderProductLogRepository } from '../../../src/services/order-product-logs/infrastructure/repository';
import { Product } from '../../../src/services/products/domain/model';
import { OrderProductLog } from '../../../src/services/order-product-logs/domain/model';

describe('OrderProductLogs E2E test', () => {
  let app: INestApplication;
  let productRepository: ProductRepository;
  let orderProductLogRepository: OrderProductLogRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ProductModule,
        OrderModule,
        OrderProductLogModule,
        TypeOrmModule.forRoot(getConfig('/ormconfig')),
        EventEmitterModule.forRoot(),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    productRepository = moduleFixture.get<ProductRepository>(ProductRepository);
    orderProductLogRepository = moduleFixture.get<OrderProductLogRepository>(OrderProductLogRepository);
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('GET /order-product-logs/ranking', () => {
    const testProducts = [
      plainToClass(Product, {
        id: 'e2eOrderProductLogTest1',
        name: 'e2eOrderProductLogTest1',
        price: 5000,
        stock: 500,
      }),
      plainToClass(Product, {
        id: 'e2eOrderProductLogTest2',
        name: 'e2eOrderProductLogTest2',
        price: 3000,
        stock: 500,
      }),
    ];

    const testOrderProductLogs = [
      plainToClass(OrderProductLog, {
        id: 10001,
        orderId: 'e2eOrderProductLogTest1',
        userId: 'e2eOrderProductLogTest1',
        productId: 'e2eOrderProductLogTest1',
        quantity: 1,
        price: 3000,
        occurredAt: new Date('2023-12-25T00:00:00.000Z'),
      }),
      plainToClass(OrderProductLog, {
        id: 10002,
        orderId: 'e2eOrderProductLogTest1',
        userId: 'e2eOrderProductLogTest1',
        productId: 'e2eOrderProductLogTest2',
        quantity: 1,
        price: 5000,
        occurredAt: new Date('2023-12-25T00:00:00.000Z'),
      }),
      plainToClass(OrderProductLog, {
        id: 10000,
        orderId: 'e2eOrderProductLogTest1',
        userId: 'e2eOrderProductLogTest1',
        productId: 'e2eOrderProductLogTest1',
        quantity: 1,
        price: 3000,
        occurredAt: new Date('2023-12-24T00:00:00.000Z'),
      }),
      plainToClass(OrderProductLog, {
        id: 10003,
        orderId: 'e2eOrderProductLogTest1',
        userId: 'e2eOrderProductLogTest1',
        productId: 'e2eOrderProductLogTest1',
        quantity: 1,
        price: 3000,
        occurredAt: new Date('2023-12-27T00:00:00.000Z'),
      }),
      plainToClass(OrderProductLog, {
        id: 10004,
        orderId: 'e2eOrderProductLogTest1',
        userId: 'e2eOrderProductLogTest1',
        productId: 'e2eOrderProductLogTest1',
        quantity: 1,
        price: 3000,
        occurredAt: new Date('2023-12-28T00:00:00.000Z'),
      }),
    ];

    beforeAll(async () => {
      await productRepository.save({ target: testProducts });
      await orderProductLogRepository.save({ target: testOrderProductLogs });
    });

    afterAll(async () => {
      await productRepository.remove({ target: testProducts });
      await orderProductLogRepository.remove({ target: testOrderProductLogs });
    });

    test('일정 시간대의 주문 순위를 볼 수 있다.', async () => {
      return request(app.getHttpServer())
        .get('/order-product-logs/rankings')
        .query({
          limit: 5,
          occurredAtStart: new Date('2023-12-25T00:00:00.000Z'),
          occurredAtEnd: new Date('2023-12-27T00:00:00.000Z'),
        })
        .expect(200)
        .expect({
          data: [
            {
              productId: 'e2eOrderProductLogTest1',
              totalPrice: 6000,
              totalQuantity: 2,
              name: 'e2eOrderProductLogTest1',
              price: 5000,
            },
            {
              productId: 'e2eOrderProductLogTest2',
              totalPrice: 5000,
              totalQuantity: 1,
              name: 'e2eOrderProductLogTest2',
              price: 3000,
            },
          ],
        });
    });
  });
});
