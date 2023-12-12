import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AccountListQueryDto } from '../../../../src/services/accounts/dto';

describe('Account Get Dto test', () => {
  describe('ListQueryDto 테스트', () => {
    test('성공 케이스', async () => {
      const dto = plainToInstance(AccountListQueryDto, {
        userId: 'test',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    describe('실패 케이스', () => {
      describe('userId', () => {
        test('userId가 없는 경우 에러를 던진다.', async () => {
          const dto = plainToInstance(AccountListQueryDto, {});
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
          const dto = plainToInstance(AccountListQueryDto, {
            userId: 123,
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
  });
});
