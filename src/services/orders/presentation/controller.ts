import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { validate } from 'class-validator';
import { OrderService } from '../application';
import { OrderBodyDto, OrderDto } from '../dto';
import { validationError } from '../../../libs/exceptions';

@Controller('/orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/')
  @HttpCode(201)
  async order(@Body() body: OrderBodyDto): Result<OrderDto> {
    const { userId, lines } = body;
    const order = await this.orderService.order({ userId, lines });
    const data = new OrderDto(order);
    const [error] = await validate(data);
    if (error) {
      throw validationError(`${error.property}: ${JSON.stringify(error.constraints)}`, {
        errorMessage: `${error.property}: ${JSON.stringify(error.constraints)}`,
      });
    }
    return { data };
  }
}
