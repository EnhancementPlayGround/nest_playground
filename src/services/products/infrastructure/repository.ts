import { Injectable } from '@nestjs/common';
import { Repository } from '../../../libs/ddd';
import { Product } from '../domain/model';
import { stripUndefined } from '../../../libs/common';
import { FindOptions, InValues, convertOptions } from '../../../libs/orm';

@Injectable()
export class ProductRepository extends Repository<Product> {
  entityClass = Product;

  async find(conditions: { ids?: string[] }, options?: FindOptions) {
    return this.getManager().find(this.entityClass, {
      where: {
        ...stripUndefined({
          id: InValues(conditions.ids),
        }),
      },
      ...convertOptions(options),
    });
  }
}
