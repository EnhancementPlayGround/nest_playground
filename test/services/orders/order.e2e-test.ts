import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { plainToClass } from 'class-transformer';
import * as request from 'supertest';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { nanoid } from 'nanoid';
import { getConfig } from '@config';
import { HttpExceptionFilter } from '@libs/exceptions';
import { OrderModule } from '../../../src/services/orders/module';
import { ProductModule } from '../../../src/services/products/module';
import { ProductRepository } from '../../../src/services/products/infrastructure/repository';
import { Product } from '../../../src/services/products/domain/model';
import { Account } from '../../../src/services/accounts/domain/model';
import { AccountRepository } from '../../../src/services/accounts/infrastructure/repository';
import { OrderRepository } from '../../../src/services/orders/infrastructure/repository';
import { AccountModule } from '../../../src/services/accounts/module';

jest.mock('nanoid');

describe('Order E2E test', () => {
  let app: INestApplication;
  let productRepository: ProductRepository;
  let accountRepository: AccountRepository;
  let orderRepository: OrderRepository;
  let dataSource: DataSource;
  let eventEmitter: EventEmitter2;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ProductModule,
        TypeOrmModule.forRoot(getConfig('/ormconfig')),
        EventEmitterModule.forRoot(),
        AccountModule,
        OrderModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    productRepository = moduleFixture.get<ProductRepository>(ProductRepository);
    accountRepository = moduleFixture.get<AccountRepository>(AccountRepository);
    orderRepository = moduleFixture.get<OrderRepository>(OrderRepository);
    dataSource = moduleFixture.get<DataSource>(DataSource);
    eventEmitter = moduleFixture.get<EventEmitter2>(EventEmitter2);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('POST /orders', () => {
    const testProducts = [
      plainToClass(Product, {
        id: 'e2eOrderTest1',
        name: 'e2eOrderTest1',
        price: 5000,
        stock: 500,
      }),
      plainToClass(Product, {
        id: 'e2eOrderTest2',
        name: 'e2eOrderTest2',
        price: 3000,
        stock: 500,
      }),
    ];

    const testAccounts = [
      plainToClass(Account, {
        id: 'e2eOrderTest1',
        userId: 'e2eOrderTest1',
        balance: 100000,
      }),
    ];

    beforeAll(async () => {
      await productRepository.save({ target: testProducts });
      await accountRepository.save({ target: testAccounts });
      const mockedNanoId = nanoid as jest.MockedFunction<typeof nanoid>;
      mockedNanoId.mockReturnValue('nanoid');
    });

    afterAll(async () => {
      await productRepository.remove({ target: testProducts });
      await accountRepository.remove({ target: testAccounts });
      await orderRepository.getManager().query('DELETE FROM `order_line`');
      await orderRepository.getManager().query('DELETE FROM `order`');
      await orderRepository.getManager().query('ALTER TABLE `order` AUTO_INCREMENT = 1');
    });

    test('주문을 생성한다.', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: 'e2eOrderTest1',
          lines: [
            { productId: 'e2eOrderTest1', quantity: 1 },
            { productId: 'e2eOrderTest2', quantity: 1 },
          ],
        })
        .expect(201)
        .expect({
          data: {
            id: 'nanoid',
            userId: 'e2eOrderTest1',
            totalAmount: 8000,
            lines: [
              { productId: 'e2eOrderTest1', quantity: 1, price: 5000 },
              { productId: 'e2eOrderTest2', quantity: 1, price: 3000 },
            ],
          },
        });

      // NOTE: eventEmitter가 전부 끝날때 까지 조회를 멈춘다.
      await new Promise<void>((resolve) => {
        eventEmitter.on('OrderPaidEvent', () => {
          resolve();
        });
      });

      await request(app.getHttpServer())
        .get('/products/e2eOrderTest1')
        .expect(200)
        .expect({
          data: {
            id: 'e2eOrderTest1',
            name: 'e2eOrderTest1',
            price: 5000,
            stock: 499,
          },
        });
      await request(app.getHttpServer())
        .get('/products/e2eOrderTest2')
        .expect(200)
        .expect({
          data: {
            id: 'e2eOrderTest2',
            name: 'e2eOrderTest2',
            price: 3000,
            stock: 499,
          },
        });
      await request(app.getHttpServer())
        .get('/accounts')
        .query({ userId: 'e2eOrderTest1' })
        .expect(200)
        .expect({
          data: [
            {
              id: 'e2eOrderTest1',
              userId: 'e2eOrderTest1',
              balance: 92000,
            },
          ],
        });
    });
  });
});
