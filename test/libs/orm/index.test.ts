import { convertOptions } from '../../../src/libs/orm';

describe('ORM lib test', () => {
  describe('convertOptions test', () => {
    test('option이 없다면 빈 객체를 반환한다.', () => {
      expect(convertOptions()).toEqual({});
    });
    test('page의 경우 limit과 함께 주어지지 않으면 page-1을 skip으로 반환한다.', () => {
      expect(convertOptions({ page: 2 })).toEqual({ skip: 1 });
    });
    test('page의 경우 limit과 함께 주어지면 page-1 * limit을 skip으로 반환하고 limit은 take로 반환한다..', () => {
      expect(convertOptions({ page: 2, limit: 50 })).toEqual({ skip: 50, take: 50 });
    });
    test('lock의 경우 그대로 반환한다.', () => {
      expect(convertOptions({ lock: { mode: 'pessimistic_write' } })).toEqual({ lock: { mode: 'pessimistic_write' } });
    });
  });
});
