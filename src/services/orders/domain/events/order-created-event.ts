import { DomainEvent } from '@libs/ddd/event';

export class OrderCreatedEvent extends DomainEvent {
  constructor(
    public orderId: string,
    public userId: string,
    public totalAmount: number,
    public lines: {
      productId: string;
      price: number;
      quantity: number;
    }[],
  ) {
    super();
  }
}
