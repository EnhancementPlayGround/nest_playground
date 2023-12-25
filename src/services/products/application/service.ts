import { Injectable } from '@nestjs/common';
import { EventEmitter2 as EventEmitter, OnEvent } from '@nestjs/event-emitter';
import { keyBy } from 'lodash';
import { ApplicationService } from '../../../libs/ddd';
import { ProductRepository } from '../infrastructure/repository';
import { injectTransactionalEntityManager } from '../../../libs/transactional';
import { ProductDto } from '../dto';
import { OrderCreatedEvent } from '../../orders/domain/events';
import { ProductOrderFailedEvent, ProductOrderedEvent } from '../domain/events';

@Injectable()
export class ProductService extends ApplicationService {
  constructor(private productRepository: ProductRepository, private eventEmitter: EventEmitter) {
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
}
