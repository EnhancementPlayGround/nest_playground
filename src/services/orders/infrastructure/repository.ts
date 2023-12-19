import { Injectable } from '@nestjs/common';
import { Repository } from '../../../libs/ddd';
import { Order } from '../domain/model';
import { internalServerError } from '../../../libs/exceptions';

@Injectable()
export class OrderRepository extends Repository<Order> {
  entityClass = Order;

  async sendToDataPlatform(args: { order: Order }) {
    return Promise.resolve();
  }
}
