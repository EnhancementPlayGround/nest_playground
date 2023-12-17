import { Injectable } from '@nestjs/common';
import { keyBy } from 'lodash';
import type { Product } from '../../../products/domain/model';

@Injectable()
export class CalculateOrderService {
  calculate(args: { orderLines: { productId: string; quantity: number }[]; products: Product[] }) {
    const { orderLines, products } = args;

    const productsById = keyBy(products, 'id');
    return orderLines.reduce(
      (acc, line) => {
        const product = productsById[line.productId];
        return {
          totalAmount: acc.totalAmount + product.price * line.quantity,
          lines: [...acc.lines, { productId: product.id, price: product.price, quantity: line.quantity }],
        };
      },
      { totalAmount: 0, lines: [] as { productId: string; price: number; quantity: number }[] },
    );
  }
}
