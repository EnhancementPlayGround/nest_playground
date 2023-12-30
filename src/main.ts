import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@libs/exceptions';
import { getConfig } from '@config';
import { AppModule } from './app.module';

const PORT = getConfig('/server/port');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(PORT).then(() => {
    console.log('Server Connected 🔥');
  });
}
bootstrap();
