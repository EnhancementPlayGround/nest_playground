import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../infrastructure/repository';
import { Transactional } from '../../../libs/transactional';
import { ApplicationService } from '../../../libs/ddd/service';

@Injectable()
export class AccountService extends ApplicationService {
  constructor(private accountRepository: AccountRepository) {
    super();
  }

  async list(userId: string) {
    return this.accountRepository.find({ userId });
  }

  @Transactional()
  async deposit(args: { userId: string; amount: number }) {
    const account = await this.accountRepository.findOneOrFail({ userId: args.userId });
    account.deposit(args.amount);
    await this.accountRepository.save([account]);
    return account;
  }
}
