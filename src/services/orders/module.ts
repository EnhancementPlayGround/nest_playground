import { Module } from '@nestjs/common';
import { OrderService } from './application';
import { OrderRepository } from './infrastructure/repository';
import { CalculateOrderService } from './domain/services';
import { OrderController } from './presentation/controller';
import { AccountModule } from '../accounts/module';
import { ProductModule } from '../products/module';

@Module({
  imports: [AccountModule, ProductModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, CalculateOrderService],
})
export class OrderModule {}
