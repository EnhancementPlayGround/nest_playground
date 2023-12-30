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
import { AccountModule } from '../../../src/services/accounts/module';
import { AccountRepository } from '../../../src/services/accounts/infrastructure/repository';
import { Account } from '../../../src/services/accounts/domain/model';

describe('Account E2E test', () => {
  let app: INestApplication;
  let repository: AccountRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AccountModule, TypeOrmModule.forRoot(getConfig('/ormconfig')), EventEmitterModule.forRoot()],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    repository = moduleFixture.get<AccountRepository>(AccountRepository);
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('GET /accounts', () => {
    const testAccounts = [
      plainToClass(Account, {
        id: 'e2eAccountTest1',
        userId: 'e2eAccountTest1',
        balance: 1000,
      }),
      plainToClass(Account, {
        id: 'e2eAccountTest2',
        userId: 'e2eAccountTest2',
        balance: 1000,
      }),
    ];
    beforeAll(async () => {
      await repository.save({ target: testAccounts });
    });

    afterAll(async () => {
      await repository.remove({ target: testAccounts });
    });

    test('userId로 account list를 조회한다.', async () => {
      return request(app.getHttpServer())
        .get('/accounts')
        .query({ userId: 'e2eAccountTest1' })
        .expect(200)
        .expect({
          data: [{ id: 'e2eAccountTest1', userId: 'e2eAccountTest1', balance: 1000 }],
        });
    });
  });

  describe('PATCH /accounts', () => {
    const testAccounts = [
      plainToClass(Account, {
        id: 'e2eAccountTest1',
        userId: 'e2eAccountTest1',
        balance: 1000,
      }),
      plainToClass(Account, {
        id: 'e2eAccountTest2',
        userId: 'e2eAccountTest2',
        balance: 1000,
      }),
    ];
    beforeAll(async () => {
      await repository.save({ target: testAccounts });
    });

    afterAll(async () => {
      await repository.remove({ target: testAccounts });
    });

    test('account의 잔액을 충전한다. - 단일 request', async () => {
      return request(app.getHttpServer())
        .patch('/accounts')
        .send({ userId: 'e2eAccountTest1', amount: 1000 })
        .expect(200)
        .expect({
          data: { id: 'e2eAccountTest1', userId: 'e2eAccountTest1', balance: 2000 },
        });
    });

    test('account의 잔액을 충전한다. - 다수 request', async () => {
      await Promise.all([
        request(app.getHttpServer()).patch('/accounts').send({ userId: 'e2eAccountTest1', amount: 1000 }),
        request(app.getHttpServer()).patch('/accounts').send({ userId: 'e2eAccountTest1', amount: 1000 }),
        request(app.getHttpServer()).patch('/accounts').send({ userId: 'e2eAccountTest1', amount: 1000 }),
        request(app.getHttpServer()).patch('/accounts').send({ userId: 'e2eAccountTest1', amount: 1000 }),
        request(app.getHttpServer()).patch('/accounts').send({ userId: 'e2eAccountTest1', amount: 1000 }),
        request(app.getHttpServer()).patch('/accounts').send({ userId: 'e2eAccountTest1', amount: 1000 }),
        request(app.getHttpServer()).patch('/accounts').send({ userId: 'e2eAccountTest1', amount: 1000 }),
        request(app.getHttpServer()).patch('/accounts').send({ userId: 'e2eAccountTest1', amount: 1000 }),
        request(app.getHttpServer()).patch('/accounts').send({ userId: 'e2eAccountTest1', amount: 1000 }),
        request(app.getHttpServer()).patch('/accounts').send({ userId: 'e2eAccountTest1', amount: 1000 }),
        request(app.getHttpServer()).patch('/accounts').send({ userId: 'e2eAccountTest1', amount: 1000 }),
      ]);

      return request(app.getHttpServer())
        .get('/accounts')
        .query({ userId: 'e2eAccountTest1' })
        .expect(200)
        .expect({
          data: [{ id: 'e2eAccountTest1', userId: 'e2eAccountTest1', balance: 13000 }],
        });
    });
  });
});
