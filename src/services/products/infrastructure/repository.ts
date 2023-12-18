import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { VersionedRepository } from '../../../libs/ddd';
import { Product } from '../domain/model';
import { stripUndefined } from '../../../libs/common';
import { FindOptions, InValues, convertOptions } from '../../../libs/orm';

@Injectable()
export class ProductRepository extends VersionedRepository<Product> {
  entityClass = Product;

  async find(args: {
    conditions: { ids?: string[] };
    options?: FindOptions;
    transactionEntityManager?: EntityManager;
  }) {
    return (args.transactionEntityManager ?? this.getManager()).find(this.entityClass, {
      where: {
        ...stripUndefined({
          id: InValues(args.conditions.ids),
        }),
      },
      ...convertOptions(args.options),
    });
  }
}
