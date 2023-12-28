import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityNotFoundError, type EntityManager } from 'typeorm';
import { Account } from '../domain/model';
import { stripUndefined } from '../../../libs/common';
import { Repository } from '../../../libs/ddd';
import { FindOptions, convertOptions } from '../../../libs/orm';

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
        // ...(args.conditions.userId ? { userId: args.conditions.userId } : {}),
        // ...stripUndefined({
        //   userId: args.conditions.userId,
        // }),
      },
      ...convertOptions(args.options),
    });
  }

  async findOneOrFail(args: {
    conditions: { userId?: string };
    options?: FindOptions;
    transactionalEntityManager?: EntityManager;
  }): Promise<Account> {
    try {
      return (args.transactionalEntityManager ?? this.getManager()).findOneOrFail(Account, {
        where: {
          ...stripUndefined({
            userId: args.conditions.userId,
          }),
        },
        ...convertOptions(args.options),
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new BadRequestException('~~');
      }
    }
  }

  // ???
  async truncate() {
    await this.getManager().clear(Account);
  }
}
