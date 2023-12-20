import { Test, TestingModule } from '@nestjs/testing';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';
import { nanoid } from 'nanoid';
import { getConfig } from '../../../src/config';
import { HttpExceptionFilter } from '../../../src/libs/exceptions';
import { OrderRepository } from '../../../src/services/orders/infrastructure/repository';
import { OrderModule } from '../../../src/services/orders/module';

jest.mock('nanoid');
describe('Product e2e', () => {
  let app: INestApplication;
  let repository: OrderRepository;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OrderModule, TypeOrmModule.forRoot(getConfig('/ormconfig'))],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    repository = moduleFixture.get<OrderRepository>(OrderRepository);

    const mockedNanoId = nanoid as jest.MockedFunction<typeof nanoid>;
    mockedNanoId.mockImplementation(() => 'nanoId');
  });

  afterEach(async () => {
    await repository.getManager().query(`DELETE FROM account WHERE id="orderTest";`);
    await repository.getManager().query(`DELETE FROM order_line WHERE id=1;`);
    await repository.getManager().query('DELETE FROM `order` WHERE id="orderTest";');
    await repository.getManager().query(`DELETE FROM product WHERE id="orderTest";`);
    await repository.getManager().query(`ALTER TABLE order_line AUTO_INCREMENT = 1;`);
  });

  test('/orders (POST)', async () => {
    await repository
      .getManager()
      .query(
        `INSERT INTO account (createdAt,updatedAt,id,userId,balance) VALUE(NOW(),NOW(),'orderTest','orderTest',500000);`,
      );
    await repository
      .getManager()
      .query(
        `INSERT INTO product (createdAt,updatedAt,id,name,price,stock) VALUE(NOW(),NOW(),'orderTest','productName',10000,500);`,
      );

    return request(app.getHttpServer())
      .post('/orders')
      .send({ userId: 'orderTest', lines: [{ productId: 'orderTest', quantity: 1 }] })
      .expect(201)
      .expect({
        data: {
          id: 'nanoId',
          userId: 'orderTest',
          totalAmount: 10000,
          lines: [{ productId: 'orderTest', price: 10000, quantity: 1, id: 1 }],
        },
      });
  });
});
