import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { OrderBodyDto } from '../../../../src/services/orders/dto';

describe('Order Post Dto test', () => {
  describe('OrderBodyDto 테스트', () => {
    test('성공 케이스', async () => {
      const dto = plainToInstance(OrderBodyDto, {
        userId: 'test',
        lines: [
          {
            productId: 'test',
            quantity: 1,
          },
        ],
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    describe('실패 케이스', () => {
      describe('userId', () => {
        test('userId가 없는 경우 에러를 던진다.', async () => {
          const dto = plainToInstance(OrderBodyDto, {
            lines: {
              productId: 'test',
              quantity: 1,
            },
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
          const dto = plainToInstance(OrderBodyDto, {
            userId: 123,
            lines: {
              productId: 'test',
              quantity: 1,
            },
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
      describe('lines', () => {
        test('lines가 없는 경우 에러를 던진다.', async () => {
          const dto = plainToInstance(OrderBodyDto, {
            userId: 'test',
          });
          const errors = await validate(dto);
          expect(errors).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                property: 'lines',
                constraints: {
                  arrayMinSize: '구매 상품이 필요합니다.',
                  isArray: '구매 상품이 필요합니다.',
                },
              }),
            ]),
          );
        });
        test('lines가 빈 배열일 경우 에러를 던진다.', async () => {
          const dto = plainToInstance(OrderBodyDto, {
            userId: 'test',
            lines: [],
          });
          const errors = await validate(dto);
          expect(errors).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                property: 'lines',
                constraints: {
                  arrayMinSize: '구매 상품이 필요합니다.',
                },
              }),
            ]),
          );
        });
        describe('LineDto 테스트', () => {
          test('productId가 없는 경우 에러를 던진다.', async () => {
            const dto = plainToInstance(OrderBodyDto, {
              userId: 'test',
              lines: [
                {
                  quantity: 1,
                },
              ],
            });
            const errors = await validate(dto);
            expect(errors).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  children: expect.arrayContaining([
                    expect.objectContaining({
                      children: expect.arrayContaining([
                        expect.objectContaining({
                          constraints: {
                            isNotEmpty: '상품 id가 필요합니다.',
                            isString: '상품 id는 문자열이어야 합니다.',
                          },
                          property: 'productId',
                        }),
                      ]),
                    }),
                  ]),
                  property: 'lines',
                }),
              ]),
            );
          });
        });
        test('productId이 string이 아닌 경우 에러를 던진다.', async () => {
          const dto = plainToInstance(OrderBodyDto, {
            userId: 'test',
            lines: [
              {
                productId: 123,
                quantity: 1,
              },
            ],
          });
          const errors = await validate(dto);
          expect(errors).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                children: expect.arrayContaining([
                  expect.objectContaining({
                    children: expect.arrayContaining([
                      expect.objectContaining({
                        constraints: {
                          isString: '상품 id는 문자열이어야 합니다.',
                        },
                        property: 'productId',
                      }),
                    ]),
                  }),
                ]),
                property: 'lines',
              }),
            ]),
          );
        });
        test('quantity가 없는 경우 에러를 던진다.', async () => {
          const dto = plainToInstance(OrderBodyDto, {
            userId: 'test',
            lines: [
              {
                projectId: 'test',
              },
            ],
          });
          const errors = await validate(dto);
          expect(errors).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                children: expect.arrayContaining([
                  expect.objectContaining({
                    children: expect.arrayContaining([
                      expect.objectContaining({
                        constraints: {
                          isNotEmpty: '구매 수량이 필요합니다.',
                          isNumber: '구매 수량은 숫자여야 합니다.',
                          min: '구매 수량은 최소 1개여야 합니다.',
                        },
                        property: 'quantity',
                      }),
                    ]),
                  }),
                ]),
                property: 'lines',
              }),
            ]),
          );
        });

        test('quantity가 1보다 작은경우 에러를 던진다.', async () => {
          const dto = plainToInstance(OrderBodyDto, {
            userId: 'test',
            lines: [
              {
                projectId: 'test',
                quantity: 0,
              },
            ],
          });
          const errors = await validate(dto);
          expect(errors).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                children: expect.arrayContaining([
                  expect.objectContaining({
                    children: expect.arrayContaining([
                      expect.objectContaining({
                        constraints: {
                          min: '구매 수량은 최소 1개여야 합니다.',
                        },
                        property: 'quantity',
                      }),
                    ]),
                  }),
                ]),
                property: 'lines',
              }),
            ]),
          );
        });
        test('quantity가 숫자가 아닌경우 에러를 던진다.', async () => {
          const dto = plainToInstance(OrderBodyDto, {
            userId: 'test',
            lines: [
              {
                projectId: 'test',
                quantity: '1개',
              },
            ],
          });
          const errors = await validate(dto);
          expect(errors).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                children: expect.arrayContaining([
                  expect.objectContaining({
                    children: expect.arrayContaining([
                      expect.objectContaining({
                        constraints: {
                          isNumber: '구매 수량은 숫자여야 합니다.',
                          min: '구매 수량은 최소 1개여야 합니다.',
                        },
                        property: 'quantity',
                      }),
                    ]),
                  }),
                ]),
                property: 'lines',
              }),
            ]),
          );
        });
      });
    });
  });
});
