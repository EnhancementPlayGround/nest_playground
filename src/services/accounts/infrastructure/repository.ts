import { Injectable } from '@nestjs/common';
import { Account } from '../domain/model';
import { stripUndefined } from '../../../libs/common';
import { Repository } from '../../../libs/ddd/repository';

@Injectable()
export class AccountRepository extends Repository<Account> {
  entityClass = Account;

  async find(conditions: { userId?: string }) {
    return this.getManager().find(this.entityClass, {
      where: {
        ...stripUndefined({
          userId: conditions.userId,
        }),
      },
    });
  }

  async findOneOrFail(conditions: { userId?: string }) {
    return this.getManager().findOneOrFail(this.entityClass, {
      where: {
        ...stripUndefined({
          userId: conditions.userId,
        }),
      },
    });
  }
}
