import { Module, forwardRef } from '@nestjs/common';
import { ProductController } from './presentation/controller';
import { ProductService } from './application';
import { ProductRepository } from './infrastructure/repository';
// NOTE: forwardRef를 사용하면 cycle이 발생할 수 있다.
// eslint-disable-next-line import/no-cycle
import { OrderModule } from '../orders/module';

@Module({
  imports: [forwardRef(() => OrderModule)],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductRepository, ProductService],
})
export class ProductModule {}
