import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { VersionedRepository } from '../../../libs/ddd';
import { Product } from '../domain/model';
import { FindOptions, InValues, convertOptions } from '../../../libs/orm';

@Injectable()
export class ProductRepository extends VersionedRepository<Product> {
  entityClass = Product;

  async find(args: {
    conditions: { ids?: string[] };
    options?: FindOptions;
    transactionalEntityManager?: EntityManager;
  }) {
    return (args.transactionalEntityManager ?? this.getManager()).find(Product, {
      where: {
        id: InValues(args.conditions.ids),
      },
      ...convertOptions(args.options),
    });
  }

  async truncate() {
    await this.getManager().clear(Product);
  }
}
