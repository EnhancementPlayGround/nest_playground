import { Injectable } from '@nestjs/common';
import { Repository } from '@libs/ddd';
import { EntityManager } from 'typeorm';
import { OrderProductLogEntity } from './entity';
import { OrderProductLog } from '../domain/model';

@Injectable()
export class OrderProductLogRepository extends Repository<OrderProductLogEntity> {
  entityClass = OrderProductLogEntity;

  async save(args: { target: OrderProductLog[]; transactionalEntityManager?: EntityManager }) {
    const entities = args.target.map(OrderProductLogEntity.of);
    await (args.transactionalEntityManager ?? this.getManager()).save(entities);
    await this.saveEvent({ events: args.target.flatMap((log) => log.getPublishedEvents()) });
  }

  async remove(args: {
    target: OrderProductLog[];
    transactionalEntityManager?: EntityManager | undefined;
  }): Promise<void> {
    const entities = args.target.map(OrderProductLogEntity.of);
    await (args.transactionalEntityManager ?? this.getManager()).remove(entities);
  }

  async getRanking({
    conditions,
    options,
  }: {
    conditions: { occurredAtStart: Date; occurredAtEnd: Date };
    options: { limit: number };
  }) {
    return this.getManager()
      .createQueryBuilder(OrderProductLogEntity, 'orderProductLog')
      .select('orderProductLog.productId', 'productId')
      .addSelect('CAST(SUM(orderProductLog.price) AS SIGNED)', 'totalPrice')
      .addSelect('CAST(SUM(orderProductLog.quantity) AS SIGNED)', 'totalQuantity')
      .where('orderProductLog.occurredAt BETWEEN :occurredAtStart AND :occurredAtEnd', {
        occurredAtStart: conditions.occurredAtStart,
        occurredAtEnd: conditions.occurredAtEnd,
      })
      .groupBy('orderProductLog.productId')
      .orderBy('totalQuantity', 'DESC')
      .addOrderBy('totalPrice', 'DESC')
      .take(options.limit)
      .getRawMany();
  }
}
