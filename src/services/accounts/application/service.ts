import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

// 의존방향대로 설정하는게 좋다.
import { AccountRepository } from '../infrastructure/repository';
import { injectTransactionalEntityManager } from '../../../libs/transactional';
import { ApplicationService } from '../../../libs/ddd/service';
import { AccountDto } from '../dto';
import { ProductOrderedEvent } from '../../products/domain/events';
import { TransactionOccurredEvent, TransactionFailedEvent } from '../domain/events';

@Injectable()
export class AccountService extends ApplicationService {
  constructor(private accountRepository: AccountRepository) {
    super();
  }

  async list(userId: string) {
    return this.dataSource.createEntityManager().transaction(async (transactionalEntityManager) => {
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
    return this.dataSource.createEntityManager().transaction(async (transactionalEntityManager) => {
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
      return new AccountDto({ id: account.id, userId: account.userId, balance: account.balance });
    });
  }

  @OnEvent('ProductOrderedEvent')
  async onProductOrderedEvent(event: ProductOrderedEvent) {
    const { userId, orderId, totalAmount } = event;
    try {
      await this.dataSource.createEntityManager().transaction(async (transactionalEntityManager) => {
        const injector = injectTransactionalEntityManager(transactionalEntityManager);
        const account = await injector(
          this.accountRepository,
          'findOneOrFail',
        )({ conditions: { userId }, options: { lock: { mode: 'pessimistic_write' } } });
        account.withdraw({ amount: totalAmount });
        await injector(this.accountRepository, 'save')({ target: [account] });
        await this.accountRepository.saveEvent({
          events: [new TransactionOccurredEvent(account.id, totalAmount, 'order', { orderId })],
        });
      });
    } catch (err) {
      await this.accountRepository.saveEvent({
        events: [new TransactionFailedEvent(userId, totalAmount, 'order', { orderId })],
      });

      throw err; // TODO: 로깅
    }
  }
}
