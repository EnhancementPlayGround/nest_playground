import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../infrastructure/repository';

@Injectable()
export class AccountService {
  constructor(private accountRepository: AccountRepository) {}

  async list(userId: string) {
    return this.accountRepository.find({ where: { userId } });
  }

  async deposit(args: { userId: string; amount: number }) {
    const account = await this.accountRepository.findOneOrFail({ where: { userId: args.userId } });
    account.deposit(args.amount);
    return this.accountRepository.save(account);
  }
}
