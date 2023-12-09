import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './libs/health/module';
import { getConfig } from './config';

@Module({
  imports: [HealthModule, TypeOrmModule.forRoot(getConfig('/ormconfig'))],
})
export class AppModule {}
