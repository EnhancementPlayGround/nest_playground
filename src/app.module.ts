import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HealthModule } from './libs/health/module';
import { getConfig } from './config';
import { AccountModule } from './services/accounts/module';
import { ProductModule } from './services/products/module';
import { OrderModule } from './services/orders/module';

@Module({
  imports: [
    HealthModule,
    TypeOrmModule.forRoot(getConfig('/ormconfig')),
    AccountModule,
    ProductModule,
    OrderModule,
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule {}
