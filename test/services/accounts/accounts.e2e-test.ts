import { Test, TestingModule } from '@nestjs/testing';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';
import { getConfig } from '../../../src/config';
import { HttpExceptionFilter } from '../../../src/libs/exceptions';
import { AccountRepository } from '../../../src/services/accounts/infrastructure/repository';
import { AccountModule } from '../../../src/services/accounts/module';

describe('Product e2e', () => {
  let app: INestApplication;
  let repository: AccountRepository;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AccountModule, TypeOrmModule.forRoot(getConfig('/ormconfig'))],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    repository = moduleFixture.get<AccountRepository>(AccountRepository);
  });

  describe('/accounts (PATCH)', () => {
    test('단일', async () => {
      await repository
        .getManager()
        .query(
          `INSERT INTO account (createdAt,updatedAt,id,userId,balance) VALUE(NOW(),NOW(),'accountTest','accountTest',0)`,
        );

      request(app.getHttpServer())
        .patch('/accounts')
        .send({ userId: 'accountTest', amount: 10000 })
        .expect(200)
        .expect({ data: { id: 'accountTest', userId: 'accountTest', balance: 10000 } });
      await repository.getManager().query(`DELETE FROM account WHERE id="accountTest"`);
    });
    test('여러 요청이 들어올 때 계산이 정확하게 되어야한다.', async () => {
      await repository
        .getManager()
        .query(
          `INSERT INTO account (createdAt,updatedAt,id,userId,balance) VALUE(NOW(),NOW(),'accountTest2','accountTest2',0)`,
        );

      await Promise.all([
        request(app.getHttpServer()).patch('/accounts').send({ userId: 'accountTest2', amount: 10000 }),
        request(app.getHttpServer()).patch('/accounts').send({ userId: 'accountTest2', amount: 10000 }),
        request(app.getHttpServer()).patch('/accounts').send({ userId: 'accountTest2', amount: 10000 }),
        request(app.getHttpServer()).patch('/accounts').send({ userId: 'accountTest2', amount: 10000 }),
      ]);
      request(app.getHttpServer())
        .get('/accounts?userId=accountTest2')
        .expect(200)
        .expect({ data: [{ id: 'accountTest2', userId: 'accountTest2', balance: 40000 }] });
      await repository.getManager().query(`DELETE FROM account WHERE id="accountTest2"`);
    });
  });

  test('/accounts (GET)', async () => {
    await repository
      .getManager()
      .query(
        `INSERT INTO account (createdAt,updatedAt,id,userId,balance) VALUE(NOW(),NOW(),'accountTest','accountTest',0)`,
      );

    request(app.getHttpServer())
      .get('/accounts?userId=accountTest')
      .expect(200)
      .expect({ data: [{ id: 'accountTest', userId: 'accountTest', balance: 0 }] });
    await repository.getManager().query(`DELETE FROM account WHERE id="accountTest"`);
  });
});
