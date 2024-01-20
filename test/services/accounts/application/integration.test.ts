import { Test } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { getConfig } from '@config';
import { AccountController } from '../../../../src/services/accounts/presentation/controller';
import { AccountService } from '../../../../src/services/accounts/application';
import { AccountRepository } from '../../../../src/services/accounts/infrastructure/repository';
import { Account } from '../../../../src/services/accounts/domain/model';

describe('Account Service integration test', () => {
  let accountService: AccountService;
  let accountRepository: AccountRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(getConfig('/ormconfig'))],
      controllers: [AccountController],
      providers: [AccountService, AccountRepository, EventEmitter2],
    }).compile();

    accountService = module.get<AccountService>(AccountService);
    accountRepository = module.get<AccountRepository>(AccountRepository);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('getList test', () => {
    const testAccounts = [
      plainToClass(Account, {
        id: 'accountTest1',
        userId: 'accountTest1',
        balance: 1000,
      }),
      plainToClass(Account, {
        id: 'accountTest2',
        userId: 'accountTest1',
        balance: 2000,
      }),
    ];
    beforeAll(async () => {
      await accountRepository.save({
        target: testAccounts,
      });
    });

    afterAll(async () => {
      const target = await accountRepository.find({ conditions: { userId: 'accountTest1' } });
      await accountRepository.remove({ target });
    });

    test('어카운트 list를 조회한다.', async () => {
      const result = await accountService.getList('accountTest1');
      expect(result).toEqual([
        {
          id: 'accountTest1',
          userId: 'accountTest1',
          balance: 1000,
        },
        {
          id: 'accountTest2',
          userId: 'accountTest1',
          balance: 2000,
        },
      ]);
    });
  });

  describe('deposit test', () => {
    const testAccounts = [
      plainToClass(Account, {
        id: 'accountTest1',
        userId: 'accountTest1',
        balance: 1000,
      }),
      plainToClass(Account, {
        id: 'accountTest2',
        userId: 'accountTest1',
        balance: 2000,
      }),
    ];
    beforeAll(async () => {
      await accountRepository.save({
        target: testAccounts,
      });
    });

    afterAll(async () => {
      const target = await accountRepository.find({ conditions: { userId: 'accountTest1' } });
      await accountRepository.remove({ target });
    });

    test('어카운트의 잔액을 충전한다', async () => {
      const result = await accountService.deposit({ userId: 'accountTest1', amount: 10000 });
      expect(result).toEqual({
        id: 'accountTest1',
        userId: 'accountTest1',
        balance: 11000,
      });
    });

    test('동시에 충전하더라도 전부 충전 되도록 해야한다.', async () => {
      await Promise.all([
        accountService.deposit({ userId: 'accountTest1', amount: 10000 }),
        accountService.deposit({ userId: 'accountTest1', amount: 10000 }),
        accountService.deposit({ userId: 'accountTest1', amount: 10000 }),
        accountService.deposit({ userId: 'accountTest1', amount: 10000 }),
        accountService.deposit({ userId: 'accountTest1', amount: 10000 }),
        accountService.deposit({ userId: 'accountTest1', amount: 10000 }),
        accountService.deposit({ userId: 'accountTest1', amount: 10000 }),
        accountService.deposit({ userId: 'accountTest1', amount: 10000 }),
        accountService.deposit({ userId: 'accountTest1', amount: 10000 }),
        accountService.deposit({ userId: 'accountTest1', amount: 10000 }),
      ]);

      const [result] = await accountService.getList('accountTest1');
      expect(result).toEqual({
        id: 'accountTest1',
        userId: 'accountTest1',
        balance: 111000,
      });
    });
  });
});
