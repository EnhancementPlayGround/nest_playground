import { Module } from '@nestjs/common';
import { OrderProductLogService } from './application';
import { OrderProductLogRepository } from './infrastructure/repository';
import { OrderProductLogController } from './presentation/controller';
import { ProductModule } from '../products/module';
import { OrderModule } from '../orders/module';

@Module({
  imports: [ProductModule, OrderModule],
  controllers: [OrderProductLogController],
  providers: [OrderProductLogService, OrderProductLogRepository],
})
export class OrderProductLogModule {}
