import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from '../application/service';
import { ProductRetrieveParamDto } from '../dto';

@Controller('/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/:id')
  async retrieve(@Param() params: ProductRetrieveParamDto) {
    const { id } = params;
    return this.productService.retrieve({ id });
  }
}
