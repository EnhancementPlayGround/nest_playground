import { Injectable } from '@nestjs/common';
import { ApplicationService } from '../../../libs/ddd';
import { ProductRepository } from '../infrastructure/repository';
import { Transactional } from '../../../libs/transactional';

@Injectable()
export class ProductService extends ApplicationService {
  constructor(private productRepository: ProductRepository) {
    super();
  }

  @Transactional()
  async retrieve({ id }: { id: string }) {
    const [product] = await this.productRepository.find({ ids: [id] });
    return product;
  }
}
