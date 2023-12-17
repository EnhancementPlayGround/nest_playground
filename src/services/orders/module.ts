import { Module } from '@nestjs/common';
import { OrderService } from './application';
import { OrderRepository } from './infrastructure/repository';
import { ProductRepository } from '../products/infrastructure/repository';
import { AccountRepository } from '../accounts/infrastructure/repository';
import { CalculateOrderService } from './domain/services';
import { OrderController } from './presentation/controller';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, ProductRepository, AccountRepository, CalculateOrderService],
})
export class OrderModule {}
