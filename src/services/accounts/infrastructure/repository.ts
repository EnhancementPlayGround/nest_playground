import { Injectable } from '@nestjs/common';
import type { EntityManager } from 'typeorm';
import { Repository } from '@libs/ddd';
import { FindOptions, convertOptions } from '@libs/orm';
import { Account } from '../domain/model';

@Injectable()
export class AccountRepository extends Repository<Account> {
  entityClass = Account;

  async find(args: {
    conditions: { userId?: string };
    options?: FindOptions;
    transactionalEntityManager?: EntityManager;
  }) {
    return (args.transactionalEntityManager ?? this.getManager()).find(Account, {
      where: {
        userId: args.conditions.userId,
      },
      ...convertOptions(args.options),
    });
  }

  async findOneOrFail(args: {
    conditions: { userId?: string };
    options?: FindOptions;
    transactionalEntityManager?: EntityManager;
  }): Promise<Account> {
    return (args.transactionalEntityManager ?? this.getManager()).findOneOrFail(Account, {
      where: {
        userId: args.conditions.userId,
      },
      ...convertOptions(args.options),
    });
  }

  async truncate() {
    await this.getManager().clear(Account);
  }
}
