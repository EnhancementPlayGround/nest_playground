import { Injectable } from '@nestjs/common';
import type { EntityManager } from 'typeorm';
import { Repository } from '@libs/ddd';
import { FindOptions, convertOptions } from '@libs/orm';
import { AccountEntity } from './entity';
import { Account } from '../domain/model';

@Injectable()
export class AccountRepository extends Repository<AccountEntity> {
  entityClass = AccountEntity;

  async save(args: { target: Account[]; transactionalEntityManager?: EntityManager }) {
    const entities = args.target.map(AccountEntity.of);
    await (args.transactionalEntityManager ?? this.getManager()).save(entities);
    await this.saveEvent({ events: args.target.flatMap((account) => account.getPublishedEvents()) });
  }

  async remove(args: { target: Account[]; transactionalEntityManager?: EntityManager }): Promise<void> {
    const entities = args.target.map(AccountEntity.of);
    await (args.transactionalEntityManager ?? this.getManager()).remove(entities);
  }

  async find(args: {
    conditions: { userId?: string };
    options?: FindOptions;
    transactionalEntityManager?: EntityManager;
  }) {
    const entities = await (args.transactionalEntityManager ?? this.getManager()).find(AccountEntity, {
      where: {
        userId: args.conditions.userId,
      },
      ...convertOptions(args.options),
    });

    return entities.map(Account.of);
  }

  async findOneOrFail(args: {
    conditions: { userId?: string };
    options?: FindOptions;
    transactionalEntityManager?: EntityManager;
  }): Promise<Account> {
    const entity = await (args.transactionalEntityManager ?? this.getManager()).findOneOrFail(AccountEntity, {
      where: {
        userId: args.conditions.userId,
      },
      ...convertOptions(args.options),
    });

    return Account.of(entity);
  }
}
