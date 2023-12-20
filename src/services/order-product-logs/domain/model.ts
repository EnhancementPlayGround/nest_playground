import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Aggregate } from '../../../libs/ddd';

@Entity()
export class OrderProductLog extends Aggregate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  orderId!: string;

  @Column()
  userId!: string;

  @Column()
  productId!: string;

  @Column()
  quantity!: number;

  @Column()
  price!: number;

  constructor(args: { orderId: string; userId: string; productId: string; quantity: number; price: number }) {
    super();
    if (args) {
      this.orderId = args.orderId;
      this.userId = args.userId;
      this.productId = args.productId;
      this.quantity = args.quantity;
      this.price = args.price;
    }
  }
}
