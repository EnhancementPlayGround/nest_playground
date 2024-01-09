import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Repository } from '@libs/ddd';
import { FindOptions, InValues, convertOptions } from '@libs/orm';
import { optimisticLockVersionMismatch } from '@libs/exceptions';
import { ProductEntity } from './entity';
import { Product } from '../domain/model';

@Injectable()
export class ProductRepository extends Repository<ProductEntity> {
  entityClass = ProductEntity;

  async save(args: { target: Product[]; transactionalEntityManager?: EntityManager }) {
    const entities = args.target.map(ProductEntity.of);
    const entityVersionOf = entities.reduce((acc, entity) => {
      acc[entity.id.toString()] = entity.version;
      return acc;
    }, {} as Record<string, number>);

    await (args.transactionalEntityManager ?? this.getManager()).save(entities, { reload: true });
    await this.saveEvent({
      events: args.target.flatMap((entity) => entity.getPublishedEvents()),
      transactionalEntityManager: args.transactionalEntityManager,
    });

    entities
      .filter((entity) => entity.version > 1) // version === 1 이면 새로 생성한 entity 이므로 버젼 체크 할 필요 없음
      .forEach((entity) => {
        if (entity.version !== entityVersionOf[entity.id.toString()] + 1) {
          throw optimisticLockVersionMismatch(
            `${entity.constructor.name}(${entity.id})'s version(${entity.version}) is mismatched.`,
            {
              errorMessage: "Something went wrong and we couldn't complete your request.",
            },
          );
        }
      });
  }

  async remove(args: { target: Product[]; transactionalEntityManager?: EntityManager }): Promise<void> {
    const entities = args.target.map(ProductEntity.of);
    await (args.transactionalEntityManager ?? this.getManager()).remove(entities);
  }

  async find(args: {
    conditions: { ids?: string[] };
    options?: FindOptions;
    transactionalEntityManager?: EntityManager;
  }) {
    const entities = await (args.transactionalEntityManager ?? this.getManager()).find(ProductEntity, {
      where: {
        id: InValues(args.conditions.ids),
      },
      ...convertOptions(args.options),
    });

    return entities.map(Product.of);
  }
}
