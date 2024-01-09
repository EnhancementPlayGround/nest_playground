import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '@libs/ddd';

@Entity('account')
@Index('Idx_userId', ['userId'])
export class AccountEntity extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  userId!: string;

  @Column()
  balance!: number;

  constructor(args: { userId: string; id: string; balance?: number }) {
    super();
    if (args) {
      this.id = args.id;
      this.userId = args.userId;
      this.balance = args.balance ?? 0;
    }
  }

  static of(args: { userId: string; id: string; balance?: number }) {
    return new AccountEntity(args);
  }
}
