import { nanoid } from 'nanoid';
import { plainToClass } from 'class-transformer';
import { Account } from '../../../../src/services/accounts/domain/model';
import { badRequest } from '../../../../src/libs/exceptions';

jest.mock('nanoid');

describe('Account model test', () => {
  beforeEach(() => {
    const mockedNanoId = nanoid as jest.Mock<string>;
    mockedNanoId.mockImplementation(() => 'nanoId');
  });

  describe('Account constructor test', () => {
    test('잔액이 0인 계좌를 생성한다.', () => {
      const account = new Account({ userId: 'testUserId' });
      expect(account).toEqual({
        id: 'nanoId',
        userId: 'testUserId',
        balance: 0,
        events: [],
      });
    });
  });

  describe('deposit test', () => {
    test('입금을 하면 입금한 금액만큼 잔액이 증가한다.', () => {
      const account = new Account({ userId: 'testUserId' });
      account.deposit(1000);
      account.deposit(1000);
      expect(account.balance).toBe(2000);
    });
  });

  describe('withdraw test', () => {
    const baseAccount = plainToClass(Account, {
      id: 'nanoId',
      userId: 'testUserId',
      balance: 2000,
    });

    test('출금을 하면 출금한 금액만큼 잔액이 감소한다.', () => {
      const account = plainToClass(Account, {
        ...baseAccount,
        balance: 2000,
      });
      account.withdraw(1000);
      expect(account.balance).toBe(1000);
    });

    test('잔액보다 출금 금액이 많으면 에러가 발생한다.', () => {
      const account = plainToClass(Account, {
        ...baseAccount,
        balance: 0,
      });
      try {
        account.withdraw(1000);
      } catch (err) {
        expect(err).toEqual(
          badRequest('Can not withdraw more than balance.', {
            errorMessage: '잔액보다 많은 금액을 출금할 수 없습니다.',
          }),
        );
      }
    });
  });
});
