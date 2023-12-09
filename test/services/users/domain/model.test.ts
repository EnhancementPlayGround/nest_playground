import { nanoid } from 'nanoid';
import { User } from '../../../../src/services/users/domain/model';

jest.mock('nanoid');

describe('User model test', () => {
  beforeEach(() => {
    const mockedNanoId = nanoid as jest.Mock<string>;
    mockedNanoId.mockImplementation(() => 'nanoId');
  });

  describe('constructor', () => {
    test('유저 모델을 생성할 수 있다.', () => {
      const user = new User({ name: 'test' });
      expect(user).toEqual({
        id: 'nanoId',
        name: 'test',
      });
    });
  });
});
