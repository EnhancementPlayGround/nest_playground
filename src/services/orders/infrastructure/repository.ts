import { Injectable } from '@nestjs/common';
import type { EntityManager } from 'typeorm';
import { Repository } from '@libs/ddd';
import { internalServerError } from '@libs/exceptions';
import { convertOptions, InValues, type FindOptions } from '@libs/orm';
import { Order } from '../domain/model';
import { OrderEntity } from './entity';

@Injectable()
export class OrderRepository extends Repository<OrderEntity> {
  entityClass = OrderEntity;

  async save(args: { target: Order[]; transactionalEntityManager?: EntityManager }) {
    const entities = args.target.map(OrderEntity.of);
    await (args.transactionalEntityManager ?? this.getManager()).save(entities);
    await this.saveEvent({
      events: args.target.flatMap((entity) => entity.getPublishedEvents()),
      transactionalEntityManager: args.transactionalEntityManager,
    });
  }

  async remove(args: { target: Order[]; transactionalEntityManager?: EntityManager }): Promise<void> {
    const entities = args.target.map(OrderEntity.of);
    await (args.transactionalEntityManager ?? this.getManager()).remove(entities);
  }

  async sendToDataPlatform(_: { order: Order }) {
    if (Math.random() < 0.01) {
      throw internalServerError('Failed to send order to data platform.', {
        errorMessage: "Something went wrong and we couldn't complete your request.",
      });
    }
  }

  async find(args: {
    conditions: { ids?: string[] };
    options?: FindOptions;
    transactionalEntityManager?: EntityManager;
  }) {
    const entities = await (args.transactionalEntityManager ?? this.getManager()).find(OrderEntity, {
      where: {
        id: InValues(args.conditions.ids),
      },
      ...convertOptions(args.options),
    });

    return entities.map(Order.of);
  }

  async softDelete(args: { target: Order[]; transactionalEntityManager?: EntityManager }) {
    const entities = args.target.map(OrderEntity.of);
    return (args.transactionalEntityManager ?? this.getManager()).softRemove(entities);
  }
}
