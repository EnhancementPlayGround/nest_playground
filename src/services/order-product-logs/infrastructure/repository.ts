import { Injectable } from '@nestjs/common';
import { Repository } from '@libs/ddd';
import { OrderProductLog } from '../domain/model';

@Injectable()
export class OrderProductLogRepository extends Repository<OrderProductLog> {
  entityClass = OrderProductLog;

  async getRanking({
    conditions,
    options,
  }: {
    conditions: { occurredAtStart: Date; occurredAtEnd: Date };
    options: { limit: number };
  }) {
    return this.getManager()
      .createQueryBuilder(OrderProductLog, 'orderProductLog')
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
