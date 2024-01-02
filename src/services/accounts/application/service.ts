import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { injectTransactionalEntityManager } from '@libs/transactional';
import { ApplicationService } from '@libs/ddd/service';
import { logger } from '@libs/logger';
import { AccountRepository } from '../infrastructure/repository';
import { AccountDto } from '../dto';
import { ProductOrderedEvent } from '../../products/domain/events';
import { TransactionOccurredEvent, TransactionFailedEvent } from '../domain/events';

@Injectable()
export class AccountService extends ApplicationService {
  constructor(private accountRepository: AccountRepository) {
    super();
  }

  async getList(userId: string) {
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

  async deposit(args: { userId: string; amount: number }) {
    return this.dataSource.createEntityManager().transaction(async (transactionalEntityManager) => {
      const injector = injectTransactionalEntityManager(transactionalEntityManager);
      const account = await injector(
        this.accountRepository,
        'findOneOrFail',
      )({
        conditions: { userId: args.userId },
        options: { lock: { mode: 'pessimistic_write' } },
      });
      account.deposit(args.amount);
      await injector(this.accountRepository, 'save')({ target: [account] });
      return AccountDto.of(account);
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
      logger.error(err);
    }
  }
}
