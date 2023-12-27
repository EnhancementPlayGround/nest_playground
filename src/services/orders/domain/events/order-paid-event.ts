import { DomainEvent } from '../../../../libs/ddd/event';

export class OrderPaidEvent extends DomainEvent {
  constructor(public orderId: string) {
    super();
  }
}
