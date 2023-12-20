import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from '../application/service';
import { ProductDto, ProductRetrieveParamDto } from '../dto';

@Controller('/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/:id')
  async retrieve(@Param() params: ProductRetrieveParamDto): Result<ProductDto> {
    const { id } = params;
    const product = await this.productService.retrieve({ id });
    return { data: product };
  }
}
