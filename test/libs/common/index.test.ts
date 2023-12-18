import { stripUndefined } from '../../../src/libs/common';

describe('stripUndefined test', () => {
  test('object 중 undefined를 제거한다.', () => {
    const result = stripUndefined({ a: 1, b: undefined, c: 3 });
    expect(result).toEqual({ a: 1, c: 3 });
  });

  test('object value들이 모두 undefined일 경우 undefined를 반환한다.', () => {
    const result = stripUndefined({ a: undefined, b: undefined, c: undefined });
    expect(result).toBeUndefined();
  });
});
