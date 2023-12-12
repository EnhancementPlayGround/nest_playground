import {
  BadRequestException,
  ForbiddenException,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { badRequest, forbidden, notImplemented, unauthorized } from '../../../src/libs/exceptions';

describe('Exception test', () => {
  test('badRequest test', async () => {
    try {
      badRequest('test');
    } catch (err) {
      expect(err).toEqual(new BadRequestException({ message: 'test' }));
    }
  });
  test('forbidden test', async () => {
    try {
      forbidden('test');
    } catch (err) {
      expect(err).toEqual(new ForbiddenException({ message: 'test' }));
    }
  });
  test('unauthorized test', async () => {
    try {
      unauthorized('test');
    } catch (err) {
      expect(err).toEqual(new UnauthorizedException({ message: 'test' }));
    }
  });
  test('notImplemented test', async () => {
    try {
      notImplemented('test');
    } catch (err) {
      expect(err).toEqual(new NotImplementedException({ message: 'test' }));
    }
  });
});
