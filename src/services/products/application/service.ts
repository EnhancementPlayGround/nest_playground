import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { keyBy } from 'lodash';
import { ApplicationService } from '@libs/ddd';
import { ProductRepository } from '../infrastructure/repository';
import { ProductDto } from '../dto';
import { OrderCreatedEvent } from '../../orders/domain/events';
import { ProductOrderFailedEvent, ProductOrderedEvent } from '../domain/events';
import { TransactionFailedEvent } from '../../accounts/domain/events/transaction-failed-event';
import { OrderRepository } from '../../orders/infrastructure/repository';
import { retry } from '../../../libs/retry';

@Injectable()
export class ProductService extends ApplicationService {
  constructor(private productRepository: ProductRepository, private orderRepository: OrderRepository) {
    super();
  }

  async getList({ ids }: { ids?: string[] }) {
    const products = await this.productRepository.find({ conditions: { ids } });

    return products.map(ProductDto.of);
  }

  async retrieve({ id }: { id: string }) {
    return this.dataSource.createEntityManager().transaction(async (transactionalEntityManager) => {
      const [product] = await this.productRepository.find({
        conditions: { ids: [id] },
        options: { lock: { mode: 'pessimistic_read' } },
        transactionalEntityManager,
      });
      return ProductDto.of(product);
    });
  }

  @OnEvent('OrderCreatedEvent')
  async onOrderCreatedEvent(event: OrderCreatedEvent) {
    const { orderId, userId, lines, totalAmount } = event;

    await retry({
      request: async () => {
        await this.dataSource.createEntityManager().transaction(async (transactionalEntityManager) => {
          const products = await this.productRepository.find({
            conditions: { ids: lines.map((line) => line.productId) },
            transactionalEntityManager,
          });
          const lineOf = keyBy(lines, 'productId');
          products.forEach((product) => {
            const line = lineOf[product.id];
            product.ordered({ quantity: line.quantity });
          });

          await this.productRepository.save({ target: products, transactionalEntityManager });
        });
        // NOTE: 여기서 하는게 맞을까..?
        await this.productRepository.saveEvent({
          events: [new ProductOrderedEvent(orderId, userId, totalAmount, lines)],
        });
      },
      options: {
        maxAttemptNumber: 3,
        onError: async () => {
          await this.productRepository.saveEvent({ events: [new ProductOrderFailedEvent(orderId)] });
        },
      },
    });
  }

  @OnEvent('TransactionFailedEvent')
  async onTransactionFailedEvent(event: TransactionFailedEvent) {
    const { transactionDetail, transactionType } = event;
    if (transactionType === 'order') {
      const { orderId } = transactionDetail;

      await this.dataSource.transaction(async (transactionalEntityManager) => {
        const [order] = await this.orderRepository.find({
          conditions: { ids: [orderId!] },
          transactionalEntityManager,
        });
        const products = await this.productRepository.find({
          conditions: { ids: order.lines.map((line) => line.productId) },
          options: { lock: { mode: 'pessimistic_write' } },
          transactionalEntityManager,
        });

        const lineOf = keyBy(order.lines, 'productId');
        products.forEach((product) => {
          product.cancel({ quantity: lineOf[product.id].quantity });
        });

        await this.productRepository.save({ target: products, transactionalEntityManager });
      });
    }
  }
}
