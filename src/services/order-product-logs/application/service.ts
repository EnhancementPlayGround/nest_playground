import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ApplicationService } from '@libs/ddd';
import { OrderProductLogRepository } from '../infrastructure/repository';
import { OrderProductLog } from '../domain/model';
import { OrderPaidEvent } from '../../orders/domain/events/order-paid-event';
import { OrderRepository } from '../../orders/infrastructure/repository';

type rankingOutput = {
  productId: string;
  totalPrice: number;
  totalQuantity: number;
  name: string;
  price: number;
};

@Injectable()
export class OrderProductLogService extends ApplicationService {
  constructor(private orderProductLogRepository: OrderProductLogRepository, private orderRepository: OrderRepository) {
    super();
  }

  async getRanking({
    occurredAtStart,
    occurredAtEnd,
    limit,
  }: {
    occurredAtStart: Date;
    occurredAtEnd: Date;
    limit: number;
  }): Promise<rankingOutput[]> {
    return this.orderProductLogRepository.getRanking({
      conditions: { occurredAtStart, occurredAtEnd },
      options: { limit },
    });
  }

  @OnEvent('OrderPaidEvent')
  async onOrderPaidEventEvent(event: OrderPaidEvent) {
    const { orderId } = event;

    const [order] = await this.orderRepository.find({ conditions: { ids: [orderId] } });

    const orderProductLogs = order.lines.map(
      (line) =>
        new OrderProductLog({
          orderId: order.id,
          userId: order.userId,
          price: line.price,
          productId: line.productId,
          quantity: line.quantity,
        }),
    );

    await this.orderProductLogRepository.save({ target: orderProductLogs });
  }
}
