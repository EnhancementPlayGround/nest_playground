import { Controller, Get, Query } from '@nestjs/common';
import { keyBy } from 'lodash';
import { OrderProductLogService } from '../application';
import { ProductService } from '../../products/application';
import { OrderProductLogGetRankingQueryDto } from '../dto';

@Controller('/order-product-logs')
export class OrderProductLogController {
  constructor(private orderProductLogService: OrderProductLogService, private productService: ProductService) {}

  @Get('/rankings')
  async getRanking(@Query() query: OrderProductLogGetRankingQueryDto) {
    // Destructure
    const { occurredAtStart, occurredAtEnd, limit } = query;

    // Call application service
    const rankings = await this.orderProductLogService.getRanking({
      occurredAtStart,
      occurredAtEnd,
      limit,
    });
    const products = await this.productService.list({ ids: rankings.map((ranking) => ranking.productId) });

    // Validate output
    // Return result
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
