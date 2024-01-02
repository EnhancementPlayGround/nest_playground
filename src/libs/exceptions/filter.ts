import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import type { Response } from 'express';
import { logger } from '../logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = error.getStatus();

    logger.error(error);

    response
      .status(status)
      // @ts-expect-error
      .json({ errorMessage: error.getResponse().errorMessage || error.getResponse().message });
  }
}
