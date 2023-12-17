import { Injectable } from '@nestjs/common';
import { Repository } from '../../../libs/ddd';
import { Order } from '../domain/model';

@Injectable()
export class OrderRepository extends Repository<Order> {
  entityClass = Order;
}
