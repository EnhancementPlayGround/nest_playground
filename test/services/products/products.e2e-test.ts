import { Test, TestingModule } from '@nestjs/testing';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';
import { ProductModule } from '../../../src/services/products/module';
import { getConfig } from '../../../src/config';
import { HttpExceptionFilter } from '../../../src/libs/exceptions';
import { ProductRepository } from '../../../src/services/products/infrastructure/repository';

describe('Product e2e', () => {
  let app: INestApplication;
  let repository: ProductRepository;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductModule, TypeOrmModule.forRoot(getConfig('/ormconfig'))],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    repository = moduleFixture.get<ProductRepository>(ProductRepository);
  });

  test('/products/:id (GET)', async () => {
    await repository
      .getManager()
      .query(
        `INSERT INTO product (createdAt,updatedAt,id,name,price,stock) VALUE(NOW(),NOW(),'productTest','productName',10000,500)`,
      );
    request(app.getHttpServer())
      .get('/products/productTest')
      .expect(200)
      .expect({ data: { id: 'productTest', name: 'productName', price: 10000, stock: 500 } });
    await repository.getManager().query(`DELETE FROM product WHERE id="productTest"`);
  });
});
