import { DomainEvent } from '../../../../libs/ddd/event';

export class ProductOrderFailedEvent extends DomainEvent {
  constructor(public orderId: string) {
    super();
  }
}
