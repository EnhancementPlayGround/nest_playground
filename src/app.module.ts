import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './libs/health/module';
import { getConfig } from './config';
import { AccountModule } from './services/accounts/module';

@Module({
  imports: [HealthModule, TypeOrmModule.forRoot(getConfig('/ormconfig')), AccountModule],
})
export class AppModule {}
