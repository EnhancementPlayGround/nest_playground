import { Controller, Get, Query } from '@nestjs/common';
import { keyBy } from 'lodash';
import { OrderProductLogService } from '../application';
import { ProductService } from '../../products/application';

@Controller('/order-product-logs')
export class OrderProductLogController {
  constructor(private orderProductLogService: OrderProductLogService, private productService: ProductService) {}

  @Get('/rankings')
  async getRanking(@Query('limit') limit: number) {
    const rankings = await this.orderProductLogService.getRanking(limit);
    const products = await this.productService.list({ ids: rankings.map((ranking) => ranking.productId) });
    const productsOf = keyBy(products, 'id');

    return {
      data: rankings.map((ranking) => {
        const product = productsOf[ranking.productId];
        return {
          ...ranking,
          name: product.name,
          price: product.price,
        };
      }),
    };
  }
}
