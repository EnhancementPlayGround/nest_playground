import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { OrderService } from '../application';
import { OrderBodyDto, OrderDto } from '../dto';

@Controller('/orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/')
  @HttpCode(201)
  async order(@Body() body: OrderBodyDto): Result<OrderDto> {
    const { userId, lines } = body;
    const order = await this.orderService.order({ userId, lines });
    return { data: order };
  }
}
