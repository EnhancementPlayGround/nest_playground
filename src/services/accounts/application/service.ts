import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../infrastructure/repository';
import { Transactional } from '../../../libs/transactional';
import { ApplicationService } from '../../../libs/ddd/service';

@Injectable()
export class AccountService extends ApplicationService {
  constructor(private accountRepository: AccountRepository) {
    super();
  }

  @Transactional()
  async list(userId: string) {
    return this.accountRepository.find({ userId }, { lock: { mode: 'pessimistic_read' } });
  }

  @Transactional()
  async deposit(args: { userId: string; amount: number }) {
    const account = await this.accountRepository.findOneOrFail(
      { userId: args.userId },
      { lock: { mode: 'pessimistic_write' } },
    );
    account.deposit(args.amount);
    await this.accountRepository.save([account]);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(1);
      }, 3000);
    });
    return account;
  }
}
