import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './application';
import { OrderRepository } from './infrastructure/repository';
import { CalculateOrderService } from './domain/services';
import { OrderController } from './presentation/controller';
// eslint-disable-next-line import/no-cycle
import { ProductModule } from '../products/module';

@Module({
  imports: [forwardRef(() => ProductModule)],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, CalculateOrderService],
})
export class OrderModule {}
