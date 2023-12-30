import { DomainEvent } from '../../../../libs/ddd/event';
import type { TransactionType } from '../model';

export class TransactionFailedEvent extends DomainEvent {
  constructor(
    public userId: string,
    public totalAmount: number,
    public transactionType: TransactionType,
    public transactionDetail: { orderId?: string },
  ) {
    super();
  }
}
