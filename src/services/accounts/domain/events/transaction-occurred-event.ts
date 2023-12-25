import { DomainEvent } from '../../../../libs/ddd/event';
import type { TransactionType } from '../model';

export class TransactionOccurredEvent extends DomainEvent {
  constructor(
    public accountId: string,
    public totalAmount: number,
    public transactionType: TransactionType,
    public transactionDetail: { orderId?: string },
  ) {
    super();
  }

  isOrderSucceed() {
    return this.transactionType === 'order' && !!this.transactionDetail.orderId;
  }
}
