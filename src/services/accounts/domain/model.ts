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
      // ? why not uuid? uuid (128bit 32개의 16진수 (4개가 필요함)) 를 BIN(16), UUID Type으로 저장하면 성능이 훨씬 좋음 z, t
      // mysql은 random gen 되는 id를 쓰면, 성능이 나락을 간다.
      // mysql 인덱스 특성:
      // PK + not null + unique -> clustered index, id가 인접한것을 실제로 인접하게 저장한다. 1, 2 랑 1, 3 이 인덱스상에서 거리가 다르다.
      // index -> 데이터가 추가되는경우 재정렬이 일어남. (auto increment id) -> 이미 정렬된 상태로 존재함, (uuid, nanoid) -> 삽입될때마다 재정렬이 일어남
      // 하드디스크가 메인이던 시절 -> 하드디스크의 헤드를 옮겨서, 다른곳을 읽는 작업이 가장 비쌌음
      // mysql uuid performance issue
      // mysql 에 테이블 두개를 만든다. id (ai , string uuid) / args / created
      // mysql -> 유료, 좌표관련 데이터타입을 올바르게 지원 안한다 (polygon...),  postgresql
      // ulid (순서가 어느정도 보장되는 uuid), snowflake...
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

interface Accountt {
  id: string;
  userId: string;
  balance: number;
}

const withDraw = ({ amount }: Account) => {
  if (this.balance < amount) {
    throw badRequest('Can not withdraw more than balance.', {
      errorMessage: '잔액보다 많은 금액을 출금할 수 없습니다.',
    });
  }
};

// account/application
// order/application

// controller, domain, entity ... -> 성질이 같은것끼리 묵는다.
