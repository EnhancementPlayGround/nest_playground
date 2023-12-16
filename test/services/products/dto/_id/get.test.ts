import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ProductRetrieveParamDto } from '../../../../../src/services/products/dto';

describe('GET products/:id DTO TEST', () => {
  describe('ProductRetrieveParamDto', () => {
    describe('id test', () => {
      test('id는 필수적으로 있어야한다.', async () => {
        const dto = plainToInstance(ProductRetrieveParamDto, {});
        const errors = await validate(dto);
        expect(errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              property: 'id',
              constraints: { isNotEmpty: '상품 id가 필요합니다.', isString: '상품 id는 문자열이어야 합니다.' },
            }),
          ]),
        );
      });
      test('id는 string 이어야 한다.', async () => {
        const dto = plainToInstance(ProductRetrieveParamDto, {
          id: 1,
        });
        const errors = await validate(dto);
        expect(errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              property: 'id',
              constraints: { isString: '상품 id는 문자열이어야 합니다.' },
            }),
          ]),
        );
      });
    });
  });
});
