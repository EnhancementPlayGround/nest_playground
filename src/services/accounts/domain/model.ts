import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { nanoid } from 'nanoid';
import { Aggregate } from '../../../libs/ddd';
import { badRequest } from '../../../libs/exceptions';

const transactionType = ['order'] as const;
export type TransactionType = (typeof transactionType)[number];

@Entity()
@Index('Idx_userId', ['userId'])
export class Account extends Aggregate {
  @PrimaryColumn()
  id!: string;

  @Column()
  userId!: string;

  @Column()
  balance!: number;

  constructor(args: { userId: string }) {
    super();
    if (args) {
      this.id = nanoid();
      this.userId = args.userId;
      this.balance = 0;
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
}
