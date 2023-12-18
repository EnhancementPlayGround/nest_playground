import { Injectable } from '@nestjs/common';
import { keyBy } from 'lodash';
import { ApplicationService } from '../../../libs/ddd';
import { OrderRepository } from '../infrastructure/repository';
import { ProductRepository } from '../../products/infrastructure/repository';
import { AccountRepository } from '../../accounts/infrastructure/repository';
import { Order } from '../domain/model';
import { injectTransactionalEntityManager } from '../../../libs/transactional';
import { CalculateOrderService } from '../domain/services';

@Injectable()
export class OrderService extends ApplicationService {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
    private accountRepository: AccountRepository,
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

      // <!-- 여기에 있는게 맞을까?
      const orderLineOf = keyBy(order.lines, 'productId');
      products.forEach((product) => {
        product.ordered({ quantity: orderLineOf[product.id].quantity });
      });

      const account = await injector(this.accountRepository.findOneOrFail)({
        conditions: { userId: args.userId },
        options: { lock: { mode: 'pessimistic_write' } },
      });

      account.withdraw(order.totalAmount);
      // -->

      // TODO: optimistic lock version mismatch error가 난다면 exponential backoff을 적용해야 한다. (with jitter)
      await injector(this.orderRepository.save)({ target: [order] });

      await Promise.all([
        injector(this.productRepository.save)({ target: products }),
        injector(this.accountRepository.save)({ target: [account] }),
      ]);

      // TODO: data platform 전송

      return order;
    });
  }
}
