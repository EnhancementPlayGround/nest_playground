import { Test } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AccountController } from '../../../../src/services/accounts/presentation/controller';
import { AccountService } from '../../../../src/services/accounts/application';
import { AccountRepository } from '../../../../src/services/accounts/infrastructure/repository';
import { Account } from '../../../../src/services/accounts/domain/model';

describe('AccountController', () => {
  let accountController: AccountController;
  let accountService: AccountService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        AccountService,
        AccountRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: jest.fn(),
            transaction: jest.fn(),
          },
        },
        EntityManager,
        EventEmitter2,
      ],
    }).compile();

    accountController = moduleRef.get<AccountController>(AccountController);
    accountService = moduleRef.get<AccountService>(AccountService);
  });

  describe('list test', () => {
    let accountServiceListSpy: jest.SpyInstance;
    beforeEach(() => {
      accountServiceListSpy = jest.spyOn(accountService, 'list').mockResolvedValueOnce([
        plainToClass(Account, {
          id: 'test',
          userId: 'test',
          balance: 0,
        }),
      ]);
    });

    test('query로 userId를 받아서 service로 전달한다.', async () => {
      await accountController.list({ userId: 'test' });
      expect(accountServiceListSpy).toHaveBeenCalledWith('test');
    });

    test('query로 userId를 받아서 Account list를 반환한다.', async () => {
      const result = await accountController.list({ userId: 'test' });
      expect(result).toEqual({ data: [{ id: 'test', userId: 'test', balance: 0 }] });
    });
  });

  describe('deposit test', () => {
    let accountServiceDepositSpy: jest.SpyInstance;
    beforeEach(() => {
      const account = plainToClass(Account, {
        id: 'test',
        userId: 'test',
        balance: 1000,
      });
      accountServiceDepositSpy = jest.spyOn(accountService, 'deposit').mockResolvedValueOnce(account);
    });

    test('userId, amount를 받아서 service로 전달한다.', async () => {
      await accountController.deposit({ userId: 'test', amount: 1000 });
      expect(accountServiceDepositSpy).toHaveBeenCalledWith({ userId: 'test', amount: 1000 });
    });

    test('query로 userId를 받아서 Account list를 반환한다.', async () => {
      const result = await accountController.deposit({ userId: 'test', amount: 1000 });
      expect(result).toEqual({ data: { id: 'test', userId: 'test', balance: 1000 } });
    });
  });
});
