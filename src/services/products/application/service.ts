import { Injectable } from '@nestjs/common';
import { ApplicationService } from '@libs/ddd';
import { injectTransactionalEntityManager } from '@libs/transactional';
import { ProductRepository } from '../infrastructure/repository';
import { ProductDto } from '../dto';

@Injectable()
export class ProductService extends ApplicationService {
  constructor(private productRepository: ProductRepository) {
    super();
  }

  async list({ ids }: { ids?: string[] }) {
    const products = await this.productRepository.find({ conditions: { ids } });

    return products.map(ProductDto.of);
  }

  async retrieve({ id }: { id: string }) {
    return this.dataSource.transaction(async (transactionEntityManager) => {
      const injector = injectTransactionalEntityManager(transactionEntityManager);
      const [product] = await injector(
        this.productRepository,
        'find',
      )({
        conditions: { ids: [id] },
        options: { lock: { mode: 'pessimistic_read' } },
      });
      return ProductDto.of(product);
    });
  }
}
