import { Injectable } from '@nestjs/common';
import { ApplicationService } from '../../../libs/ddd';
import { OrderRepository } from '../infrastructure/repository';
import { ProductRepository } from '../../products/infrastructure/repository';
import { Order } from '../domain/model';
import { injectTransactionalEntityManager } from '../../../libs/transactional';
import { CalculateOrderService } from '../domain/services';
import { OrderDto } from '../dto';

@Injectable()
export class OrderService extends ApplicationService {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
    private calculateOrderService: CalculateOrderService,
  ) {
    super();
  }

  async order(args: { userId: string; lines: { productId: string; quantity: number }[] }) {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const injector = injectTransactionalEntityManager(transactionalEntityManager);
      const products = await this.productRepository.find({
        conditions: { ids: args.lines.map((line) => line.productId) },
      });

      const order = Order.from({
        userId: args.userId,
        lines: args.lines,
        calculateOrderService: this.calculateOrderService,
        products,
      });

      await injector(this.orderRepository, 'save')({ target: [order] });

      return new OrderDto({
        id: order.id,
        userId: order.userId,
        lines: order.lines,
        totalAmount: order.totalAmount,
      });
    });
  }
}
