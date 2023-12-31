import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ApplicationService } from '@libs/ddd';
import { OrderRepository } from '../infrastructure/repository';
import { ProductRepository } from '../../products/infrastructure/repository';
import { Order } from '../domain/model';
import { CalculateOrderService } from '../domain/services';
import { OrderDto } from '../dto';
import { TransactionOccurredEvent } from '../../accounts/domain/events';
import { OrderCreatedEvent, OrderPaidEvent } from '../domain/events';
import { ProductOrderFailedEvent } from '../../products/domain/events';
import { TransactionFailedEvent } from '../../accounts/domain/events/transaction-failed-event';

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
    const order = await this.dataSource.createEntityManager().transaction(async (transactionalEntityManager) => {
      const products = await this.productRepository.find({
        conditions: { ids: args.lines.map((line) => line.productId) },
        transactionalEntityManager,
      });

      const order = Order.from({
        userId: args.userId,
        lines: args.lines,
        calculateOrderService: this.calculateOrderService,
        products,
      });

      await this.orderRepository.save({ target: [order], transactionalEntityManager });

      return OrderDto.of(order);
    });
    await this.orderRepository.saveEvent({
      events: [new OrderCreatedEvent(order.id, order.userId, order.totalAmount, order.lines)],
    });
    return order;
  }

  @OnEvent('TransactionOccurredEvent')
  async onProductOrderedEvent(event: TransactionOccurredEvent) {
    const { transactionDetail } = event;

    if (event.isOrderSucceed()) {
      await this.dataSource.createEntityManager().transaction(async (transactionalEntityManager) => {
        const [order] = await this.orderRepository.find({
          conditions: { ids: [transactionDetail.orderId!] },
          transactionalEntityManager,
        });

        order.paid();
        await this.orderRepository.save({ target: [order], transactionalEntityManager });
      });
    }
  }

  @OnEvent('ProductOrderFailedEvent')
  @OnEvent('TransactionFailedEvent')
  async onFailedEvent(event: ProductOrderFailedEvent | TransactionFailedEvent) {
    let orderId: string;
    if (event instanceof ProductOrderFailedEvent) {
      orderId = event.orderId;
    }
    if (event instanceof TransactionFailedEvent) {
      orderId = event.transactionDetail.orderId!;
    }

    await this.dataSource.createEntityManager().transaction(async (transactionalEntityManager) => {
      const [order] = await this.orderRepository.find({ conditions: { ids: [orderId] }, transactionalEntityManager });

      await this.orderRepository.softDelete({ target: [order], transactionalEntityManager });
    });
  }

  @OnEvent('OrderPaidEvent')
  async onOrderPaidEvent(event: OrderPaidEvent) {
    const { orderId } = event;
    const [order] = await this.orderRepository.find({ conditions: { ids: [orderId] } });
    await this.orderRepository.sendToDataPlatform({ order });
  }
}
