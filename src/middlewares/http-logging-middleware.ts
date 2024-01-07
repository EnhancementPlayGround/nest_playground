import { Injectable, NestMiddleware } from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Request, Response, NextFunction } from 'express';
import { logger } from '../libs/logger';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, params, query, body, headers } = req;

    logger.info(
      `HttpRequest [${method}] ${url}\n` +
        `Headers: {\n${Object.keys(headers)
          .map((key) => ` "${key}": "${headers[key]}"`)
          .join(',\n')}\n}\n` +
        `Params: ${JSON.stringify(params, null, 2)}\n` +
        `Query: ${JSON.stringify(query, null, 2).replace(/,/g, ',/n')}\n` +
        `Body: ${JSON.stringify(body, null, 2)}\n`,
    );

    // response logging
    const responseHandler = res.send;
    // @ts-expect-error
    res.send = function (responseBody: any) {
      const { statusCode } = res;

      res.send = responseHandler;
      res.send(responseBody);
      logger.info(
        `HttpResponse [status: ${statusCode}]\n` +
          `Body: {${JSON.stringify(JSON.parse(responseBody), null, '').replace(/,/g, ',\n')}}`,
      );
    };

    next();
  }
}
