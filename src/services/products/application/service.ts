import { Injectable } from '@nestjs/common';
import { ApplicationService } from '../../../libs/ddd';
import { ProductRepository } from '../infrastructure/repository';
import { injectTransactionalEntityManager } from '../../../libs/transactional';

@Injectable()
export class ProductService extends ApplicationService {
  constructor(private productRepository: ProductRepository) {
    super();
  }

  async list({ ids }: { ids?: string[] }) {
    return this.productRepository.find({ conditions: { ids } });
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
      return product;
    });
  }
}
