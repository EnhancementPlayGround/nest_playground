import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@libs/ddd';

@Entity('account')
@Index('Idx_userId', ['userId'])
export class AccountEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: string;

  @Column()
  balance!: number;

  @Column({ unique: true })
  uniquenessKey!: string;

  constructor(args: { userId: string; id: string; balance?: number; index?: number }) {
    super();
    if (args) {
      // @ts-expect-error FIXME: id는 처음 생성시에 존재하지 않으나 이후에는 존재하기 때문에 이렇게 일단 처리한다.
      this.id = args.index;
      this.userId = args.userId;
      this.balance = args.balance ?? 0;
      this.uniquenessKey = args.id;
    }
  }

  static of(args: { userId: string; id: string; balance?: number; index?: number }) {
    return new AccountEntity(args);
  }
}
