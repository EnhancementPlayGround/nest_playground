import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../infrastructure/repository';

@Injectable()
export class AccountService {
  constructor(private accountRepository: AccountRepository) {}

  async list(userId: string) {
    return this.accountRepository.find({ where: { userId } });
  }
}
