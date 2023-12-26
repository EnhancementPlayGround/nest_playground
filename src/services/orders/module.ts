import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './application';
import { OrderRepository } from './infrastructure/repository';
import { CalculateOrderService } from './domain/services';
import { OrderController } from './presentation/controller';
// NOTE: forwardRef를 사용하면 cycle이 발생할 수 있다.
// eslint-disable-next-line import/no-cycle
import { ProductModule } from '../products/module';

@Module({
  imports: [forwardRef(() => ProductModule)],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, CalculateOrderService],
  exports: [OrderRepository],
})
export class OrderModule {}
