import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { keyBy } from 'lodash';
import { ApplicationService } from '../../../libs/ddd';
import { ProductRepository } from '../infrastructure/repository';
import { injectTransactionalEntityManager } from '../../../libs/transactional';
import { ProductDto } from '../dto';
import { OrderCreatedEvent } from '../../orders/domain/events';
import { ProductOrderFailedEvent, ProductOrderedEvent } from '../domain/events';
import { TransactionFailedEvent } from '../../accounts/domain/events/transaction-failed-event';
import { OrderRepository } from '../../orders/infrastructure/repository';

@Injectable()
export class ProductService extends ApplicationService {
  constructor(private productRepository: ProductRepository, private orderRepository: OrderRepository) {
    super();
  }

  async list({ ids }: { ids?: string[] }) {
    const products = await this.productRepository.find({ conditions: { ids } });

    return products.map(
      (product) => new ProductDto({ id: product.id, name: product.name, price: product.price, stock: product.stock }),
    );
  }

  async retrieve({ id }: { id: string }) {
    return this.dataSource.createEntityManager().transaction(async (transactionEntityManager) => {
      const injector = injectTransactionalEntityManager(transactionEntityManager);
      const [product] = await injector(
        this.productRepository,
        'find',
      )({
        conditions: { ids: [id] },
        options: { lock: { mode: 'pessimistic_read' } },
      });
      return new ProductDto({ id: product.id, name: product.name, price: product.price, stock: product.stock });
    });
  }

  @OnEvent('OrderCreatedEvent')
  async onOrderCreatedEvent(event: OrderCreatedEvent) {
    const { orderId, userId, lines, totalAmount } = event;

    try {
      await this.dataSource.createEntityManager().transaction(async (transactionalEntityManager) => {
        const injector = injectTransactionalEntityManager(transactionalEntityManager);
        const products = await injector(
          this.productRepository,
          'find',
        )({
          conditions: { ids: lines.map((line) => line.productId) },
          options: { lock: { mode: 'pessimistic_write' } },
        });
        const lineOf = keyBy(lines, 'productId');
        products.forEach((product) => {
          const line = lineOf[product.id];
          product.ordered({ quantity: line.quantity });
        });

        await injector(this.productRepository, 'save')({ target: products });
      });
      // NOTE: 여기서 하는게 맞을까..?
      await this.productRepository.saveEvent({
        events: [new ProductOrderedEvent(orderId, userId, totalAmount, lines)],
      });
    } catch (err) {
      await this.productRepository.saveEvent({ events: [new ProductOrderFailedEvent(orderId)] });
      throw err; // TODO: 로깅
    }
  }

  @OnEvent('TransactionFailedEvent')
  async onTransactionFailedEvent(event: TransactionFailedEvent) {
    const { transactionDetail, transactionType } = event;
    if (transactionType === 'order') {
      const { orderId } = transactionDetail;

      await this.dataSource.transaction(async (transactionalEntityManager) => {
        const injector = injectTransactionalEntityManager(transactionalEntityManager);

        const [order] = await injector(this.orderRepository, 'find')({ conditions: { ids: [orderId!] } });
        const products = await injector(
          this.productRepository,
          'find',
        )({
          conditions: { ids: order.lines.map((line) => line.productId) },
          options: { lock: { mode: 'pessimistic_write' } },
        });

        const lineOf = keyBy(order.lines, 'productId');
        products.forEach((product) => {
          product.cancel({ quantity: lineOf[product.id].quantity });
        });

        await injector(this.productRepository, 'save')({ target: products });
      });
    }
  }
}
