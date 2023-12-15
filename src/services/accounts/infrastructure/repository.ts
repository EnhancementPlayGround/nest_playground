import { Injectable } from '@nestjs/common';
import { Account } from '../domain/model';
import { stripUndefined } from '../../../libs/common';
import { Repository } from '../../../libs/ddd';
import { FindOptions, convertOptions } from '../../../libs/orm';

@Injectable()
export class AccountRepository extends Repository<Account> {
  entityClass = Account;

  async find(conditions: { userId?: string }, options?: FindOptions) {
    return this.getManager().find(this.entityClass, {
      where: {
        ...stripUndefined({
          userId: conditions.userId,
        }),
      },
      ...convertOptions(options),
    });
  }

  async findOneOrFail(conditions: { userId?: string }, options?: FindOptions) {
    return this.getManager().findOneOrFail(this.entityClass, {
      where: {
        ...stripUndefined({
          userId: conditions.userId,
        }),
      },
      ...convertOptions(options),
    });
  }
}
