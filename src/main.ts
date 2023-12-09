import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConfig } from './config';

const PORT = getConfig('/server/port');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT).then(() => {
    console.log('Server Connected 🔥');
  });
}
bootstrap();
