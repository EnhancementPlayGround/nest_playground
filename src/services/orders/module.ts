import { Module } from '@nestjs/common';
import { OrderService } from './application';
import { OrderRepository } from './infrastructure/repository';
import { CalculateOrderService } from './domain/services';
import { OrderController } from './presentation/controller';
import { ProductModule } from '../products/module';

@Module({
  imports: [ProductModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, CalculateOrderService],
  exports: [OrderRepository],
})
export class OrderModule {}
