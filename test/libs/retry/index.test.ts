import { badRequest } from '../../../src/libs/exceptions';
import { retry } from '../../../src/libs/retry';

jest.useRealTimers();

describe('retry test', () => {
  test(
    '에러가 난다면 원하는 횟수만큼 재시도를 한다.',
    async () => {
      let count = 0;
      expect.assertions(1);
      try {
        await retry({
          request: async () => {
            count += 1;
            throw new Error('test');
          },
          options: {
            maxAttemptNumber: 5,
            onError: async () => {
              return undefined;
            },
          },
        });
      } catch {
        expect(count).toBe(5);
      }
    },
    1000 * 31,
  );

  test(
    '에러가 maxAttemptNumber만큼 실행할 동안 계속해서 발생한다면 에러를 던진다.',
    async () => {
      expect.assertions(1);
      try {
        await retry({
          request: async () => {
            throw badRequest('test', { errorMessage: 'testTest' });
          },
          options: {
            maxAttemptNumber: 2,
            onError: async () => {
              return undefined;
            },
          },
        });
      } catch (err) {
        expect(err).toEqual(badRequest('test', { errorMessage: 'testTest' }));
      }
    },
    1000 * 7,
  );
  test(
    'maxAttemptNumber보다 적게 시도 했을 때 에러가 더이상 나지 않는다면 에러를 던지지 않고 값을 반환한다.',
    async () => {
      let count = 0;
      let result;
      expect.assertions(1);
      try {
        result = await retry({
          request: async () => {
            count += 1;
            if (count === 1) {
              throw badRequest('test', { errorMessage: 'testTest' });
            }
            return count;
          },
          options: {
            maxAttemptNumber: 3,
            onError: async () => {
              return undefined;
            },
          },
        });
      } catch (err) {
        expect(err).toBeNull();
      }
      expect(result).toBe(2);
    },
    1000 * 13,
  );
});
