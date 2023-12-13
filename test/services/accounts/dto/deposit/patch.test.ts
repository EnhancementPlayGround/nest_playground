import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AccountDepositBodyDto } from '../../../../../src/services/accounts/dto/deposit';

describe('Account Deposit Patch Dto test', () => {
  describe('DepositBodyDto 테스트', () => {
    test('성공 케이스', async () => {
      const dto = plainToInstance(AccountDepositBodyDto, {
        userId: 'test',
        amount: 100,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    describe('실패 케이스', () => {
      describe('userId', () => {
        test('userId가 없는 경우 에러를 던진다.', async () => {
          const dto = plainToInstance(AccountDepositBodyDto, {
            amount: 1000,
          });
          const errors = await validate(dto);
          expect(errors).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                property: 'userId',
                constraints: { isNotEmpty: 'userId가 필요합니다.', isString: 'userId는 문자열이어야 합니다.' },
              }),
            ]),
          );
        });
        test('userId가 string이 아닌 경우 에러를 던진다.', async () => {
          const dto = plainToInstance(AccountDepositBodyDto, {
            userId: 123,
            amount: 1000,
          });
          const errors = await validate(dto);
          expect(errors).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                property: 'userId',
                constraints: { isString: 'userId는 문자열이어야 합니다.' },
              }),
            ]),
          );
        });
      });
    });

    describe('amount', () => {
      test('amount가 없는 경우 에러를 던진다.', async () => {
        const dto = plainToInstance(AccountDepositBodyDto, {
          userId: 'testUserId',
        });
        const errors = await validate(dto);
        expect(errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              property: 'amount',
              constraints: {
                isNotEmpty: '충전 금액이 필요합니다.',
                isNumber: '충전 금액은 숫자여야 합니다.',
                min: '충전 금액은 1원 이상이어야 합니다.',
              },
            }),
          ]),
        );
      });
      test('amount가 number가 아닌 경우 에러를 던진다.', async () => {
        const dto = plainToInstance(AccountDepositBodyDto, {
          userId: 'testUserId',
          amount: '100',
        });
        const errors = await validate(dto);
        expect(errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              property: 'amount',
              constraints: {
                isNumber: '충전 금액은 숫자여야 합니다.',
                min: '충전 금액은 1원 이상이어야 합니다.',
              },
            }),
          ]),
        );
      });
      test('amount가 1원보다 적은 경우 에러를 던진다.', async () => {
        const dto = plainToInstance(AccountDepositBodyDto, {
          userId: 'testUserId',
          amount: -100,
        });
        const errors = await validate(dto);
        expect(errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              property: 'amount',
              constraints: {
                min: '충전 금액은 1원 이상이어야 합니다.',
              },
            }),
          ]),
        );
      });
    });
  });
});
