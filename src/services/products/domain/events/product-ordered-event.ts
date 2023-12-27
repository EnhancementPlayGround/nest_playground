import { DomainEvent } from '../../../../libs/ddd/event';

export class ProductOrderedEvent extends DomainEvent {
  constructor(
    public orderId: string,
    public userId: string,
    public totalAmount: number,
    public lines: { productId: string; quantity: number }[],
  ) {
    super();
  }
}
