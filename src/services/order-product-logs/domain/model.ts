import { Aggregate } from '@libs/ddd';

export class OrderProductLog extends Aggregate {
  id!: number;

  orderId!: string;

  userId!: string;

  productId!: string;

  quantity!: number;

  price!: number;

  occurredAt!: Date;

  constructor(args: { orderId: string; userId: string; productId: string; quantity: number; price: number }) {
    super();
    if (args) {
      this.orderId = args.orderId;
      this.userId = args.userId;
      this.productId = args.productId;
      this.quantity = args.quantity;
      this.price = args.price;
      this.occurredAt = new Date();
    }
  }
}
