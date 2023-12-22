import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../infrastructure/repository';
import { injectTransactionalEntityManager } from '../../../libs/transactional';
import { ApplicationService } from '../../../libs/ddd/service';
import { AccountDto } from '../dto';

@Injectable()
export class AccountService extends ApplicationService {
  constructor(private accountRepository: AccountRepository) {
    super();
  }

  async list(userId: string) {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const injector = injectTransactionalEntityManager(transactionalEntityManager);
      const accounts = await injector(
        this.accountRepository,
        'find',
      )({
        conditions: { userId },
        options: { lock: { mode: 'pessimistic_read' } },
      });

      return accounts.map((account) => {
        return new AccountDto({ id: account.id, userId: account.userId, balance: account.balance });
      });
    });
  }

  async deposit(args: { userId: string; amount: number }) {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const injector = injectTransactionalEntityManager(transactionalEntityManager);
      const account = await injector(
        this.accountRepository,
        'findOneOrFail',
      )({
        conditions: { userId: args.userId },
        options: { lock: { mode: 'pessimistic_write' } },
      });
      account.deposit(args.amount);
      await injector(this.accountRepository, 'save')({ target: [account] });
      return new AccountDto({ id: account.id, userId: account.userId, balance: account.balance });
    });
  }
}
