import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { OrderService } from '../application';
import { OrderBodyDto } from '../dto';

@Controller('/orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/')
  @HttpCode(201)
  async order(@Body() body: OrderBodyDto) {
    const { userId, lines } = body;
    return this.orderService.order({ userId, lines });
  }
}
