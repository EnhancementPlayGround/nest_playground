import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HealthModule } from './libs/health/module';
import { getConfig } from './config';
import { AccountModule } from './services/accounts/module';
import { ProductModule } from './services/products/module';
import { OrderModule } from './services/orders/module';
import { OrderProductLogModule } from './services/order-product-logs/module';

@Module({
  imports: [
    TypeOrmModule.forRoot(getConfig('/ormconfig')),
    EventEmitterModule.forRoot(),
    HealthModule,
    AccountModule,
    ProductModule,
    OrderModule,
    OrderProductLogModule,
  ],
})
export class AppModule {}
