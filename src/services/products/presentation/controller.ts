import { Controller, Get, Param } from '@nestjs/common';
import { validate } from 'class-validator';
import { validationError } from '@libs/exceptions';
import { ProductService } from '../application/service';
import { ProductDto, ProductRetrieveParamDto } from '../dto';

@Controller('/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/:id')
  async retrieve(@Param() params: ProductRetrieveParamDto): Result<ProductDto> {
    // Destructure
    const { id } = params;

    // Call application service
    const data = await this.productService.retrieve({ id });

    // Validate output
    const [error] = await validate(data);
    if (error) {
      throw validationError(`${error.property}: ${JSON.stringify(error.constraints)}`, {
        errorMessage: `${error.property}: ${JSON.stringify(error.constraints)}`,
      });
    }

    // Return result
    return {
      data,
    };
  }
}
