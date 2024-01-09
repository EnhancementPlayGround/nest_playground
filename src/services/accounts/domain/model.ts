import { nanoid } from 'nanoid';
import { badRequest } from '@libs/exceptions';
import { Aggregate } from '@libs/ddd';
import { AccountEntity } from '../infrastructure/entity';

const transactionType = ['order'] as const;
export type TransactionType = (typeof transactionType)[number];

export class Account extends Aggregate {
  id!: string;

  userId!: string;

  balance!: number;

  constructor(args: { id?: string; userId: string; balance?: number }) {
    super();
    if (args) {
      this.id = args.id ?? nanoid();
      this.userId = args.userId;
      this.balance = args.balance ?? 0;
    }
  }

  deposit(amount: number) {
    this.balance += amount;
  }

  withdraw({ amount }: { amount: number }) {
    if (this.balance < amount) {
      throw badRequest('Can not withdraw more than balance.', {
        errorMessage: '잔액보다 많은 금액을 출금할 수 없습니다.',
      });
    }

    this.balance -= amount;
  }

  static of(args: { id?: string; userId: string; balance?: number }) {
    return new Account(args);
  }

  toEntity() {
    return new AccountEntity(this);
  }
}
