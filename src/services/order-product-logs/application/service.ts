import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ApplicationService } from '../../../libs/ddd';
import { OrderProductLogRepository } from '../infrastructure/repository';
import { OrderCreatedEvent } from '../../orders/domain/events';
import { OrderProductLog } from '../domain/model';

@Injectable()
export class OrderProductLogService extends ApplicationService {
  constructor(private orderProductLogRepository: OrderProductLogRepository) {
    super();
  }

  async getRanking(limit: number) {
    return this.orderProductLogRepository.getRanking(limit);
  }

  @OnEvent('OrderCreatedEvent')
  async onOrderCreatedEvent(event: OrderCreatedEvent) {
    const { orderId, userId, lines } = event;

    const orderProductLogs = lines.map(
      (line) =>
        new OrderProductLog({ orderId, userId, price: line.price, productId: line.productId, quantity: line.quantity }),
    );

    await this.orderProductLogRepository.save({ target: orderProductLogs });
  }
}
