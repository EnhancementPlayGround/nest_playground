import { Injectable } from '@nestjs/common';
import type { EntityManager } from 'typeorm';
import { Repository } from '../../../libs/ddd';
import { Order } from '../domain/model';
import { internalServerError } from '../../../libs/exceptions';
import { convertOptions, InValues, type FindOptions } from '../../../libs/orm';

@Injectable()
export class OrderRepository extends Repository<Order> {
  entityClass = Order;

  async sendToDataPlatform(args: { order: Order }) {
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
    return (args.transactionalEntityManager ?? this.getManager()).find(Order, {
      where: {
        id: InValues(args.conditions.ids),
      },
      ...convertOptions(args.options),
    });
  }

  async softDelete(args: { target: Order[]; transactionalEntityManager?: EntityManager }) {
    return (args.transactionalEntityManager ?? this.getManager()).softRemove(args.target);
  }
}
