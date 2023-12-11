import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConfig } from './config';
import { HttpExceptionFilter } from './libs/exceptions';

const PORT = getConfig('/server/port');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(PORT).then(() => {
    console.log('Server Connected 🔥');
  });
}
bootstrap();
