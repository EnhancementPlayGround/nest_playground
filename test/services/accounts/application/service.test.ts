import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { AccountController } from '../../../../src/services/accounts/presentation/controller';
import { AccountService } from '../../../../src/services/accounts/application';
import { AccountRepository } from '../../../../src/services/accounts/infrastructure/repository';
import { Account } from '../../../../src/services/accounts/domain/model';

describe('AccountController', () => {
  let accountService: AccountService;
  let accountRepository: AccountRepository;

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
          },
        },
      ],
    }).compile();

    accountService = moduleRef.get<AccountService>(AccountService);
    accountRepository = moduleRef.get<AccountRepository>(AccountRepository);
  });

  describe('list test', () => {
    let accountRepositoryListSpy: jest.SpyInstance;
    beforeEach(() => {
      accountRepositoryListSpy = jest.spyOn(accountRepository, 'find').mockResolvedValueOnce([
        plainToClass(Account, {
          id: 'test',
          userId: 'test',
          balance: 0,
        }),
      ]);
    });

    test('parameter로 userId를 받아 repository로 전달한다.', async () => {
      await accountService.list('test');
      expect(accountRepositoryListSpy).toHaveBeenCalledWith({ where: { userId: 'test' } });
    });

    test('parameter로 userId를 받아  Account list를 반환한다.', async () => {
      const result = await accountService.list('test');
      expect(result).toEqual([{ id: 'test', userId: 'test', balance: 0 }]);
    });
  });

  describe('deposit test', () => {
    let accountRepositoryFindOneOrFailSpy: jest.SpyInstance;
    let accountRepositorySaveSpy: jest.SpyInstance;
    beforeEach(() => {
      accountRepositoryFindOneOrFailSpy = jest.spyOn(accountRepository, 'findOneOrFail').mockResolvedValueOnce(
        plainToClass(Account, {
          id: 'test',
          userId: 'test',
          balance: 0,
        }),
      );
      accountRepositorySaveSpy = jest.spyOn(accountRepository, 'save').mockResolvedValueOnce(
        plainToClass(Account, {
          id: 'test',
          userId: 'test',
          balance: 1000,
        }),
      );
    });

    test('parameter로 userId를 받아 repository로 전달한다.', async () => {
      await accountService.deposit({ userId: 'test', amount: 1000 });
      expect(accountRepositoryFindOneOrFailSpy).toHaveBeenCalledWith({ where: { userId: 'test' } });
    });

    test('account에 입금 후 저장한다.', async () => {
      await accountService.deposit({ userId: 'test', amount: 1000 });
      expect(accountRepositorySaveSpy).toHaveBeenCalledTimes(1);
      expect(accountRepositorySaveSpy).toHaveBeenCalledWith({
        id: 'test',
        userId: 'test',
        balance: 1000,
      });
    });
  });
});
