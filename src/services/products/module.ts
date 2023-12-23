import { Module } from '@nestjs/common';
import { ProductController } from './presentation/controller';
import { ProductService } from './application';
import { ProductRepository } from './infrastructure/repository';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductRepository, ProductService],
})
export class ProductModule {}
