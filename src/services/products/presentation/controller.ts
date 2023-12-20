import { Controller, Get, Param } from '@nestjs/common';
import { validate } from 'class-validator';
import { ProductService } from '../application/service';
import { ProductDto, ProductRetrieveParamDto } from '../dto';
import { validationError } from '../../../libs/exceptions';

@Controller('/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/:id')
  async retrieve(@Param() params: ProductRetrieveParamDto): Result<ProductDto> {
    const { id } = params;
    const product = await this.productService.retrieve({ id });
    const data = new ProductDto(product);
    const [error] = await validate(data);
    if (error) {
      throw validationError(`${error.property}: ${JSON.stringify(error.constraints)}`, {
        errorMessage: `${error.property}: ${JSON.stringify(error.constraints)}`,
      });
    }
    return {
      data,
    };
  }
}
