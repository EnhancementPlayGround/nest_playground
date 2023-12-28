import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module'; // 절대경로 import하는게 보다 낫다.
import { getConfig } from './config';
import { HttpExceptionFilter } from './libs/exceptions';

const PORT = getConfig('/server/port'); // nest.js ConfigModule 사용

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());
  // 불필요한 await 혹은 then을 빼야함
  await app.listen(PORT);
  console.log('Server Connected 🔥'); // 포트정보도 같이 남겨주는게 정신건강에 이로울지도?
}
bootstrap();
