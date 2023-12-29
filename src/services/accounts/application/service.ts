import { Injectable } from '@nestjs/common';
import { injectTransactionalEntityManager } from '@libs/transactional';
import { ApplicationService } from '@libs/ddd/service';
import { AccountRepository } from '../infrastructure/repository';
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

      return accounts.map(AccountDto.of);
    });
  }

  async deposit({ userId, amount }: { userId: string; amount: number }) {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const injector = injectTransactionalEntityManager(transactionalEntityManager);
      const account = await injector(
        this.accountRepository,
        'findOneOrFail',
      )({
        conditions: { userId },
        options: { lock: { mode: 'pessimistic_write' } },
      });
      account.deposit(amount);
      await injector(this.accountRepository, 'save')({ target: [account] });
      return AccountDto.of(account);
    });
  }
}
