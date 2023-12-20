import { Injectable } from '@nestjs/common';
import { Repository } from '../../../libs/ddd';
import { OrderProductLog } from '../domain/model';

@Injectable()
export class OrderProductLogRepository extends Repository<OrderProductLog> {
  entityClass = OrderProductLog;

  async getRanking(limit: number) {
    return this.getManager()
      .createQueryBuilder(OrderProductLog, 'orderProductLog')
      .select('orderProductLog.productId', 'productId')
      .addSelect('SUM(orderProductLog.price)', 'totalPrice')
      .addSelect('SUM(orderProductLog.quantity)', 'totalQuantity')
      .groupBy('orderProductLog.productId')
      .orderBy('totalQuantity', 'DESC')
      .addOrderBy('totalPrice', 'DESC')
      .take(limit)
      .getRawMany();
  }
}
