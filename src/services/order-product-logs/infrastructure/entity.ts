import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@libs/ddd';

type CtorType = {
  id: number;
  orderId: string;
  userId: string;
  productId: string;
  quantity: number;
  price: number;
  occurredAt: Date;
};
@Entity('order_product_log')
export class OrderProductLogEntity extends BaseEntity {
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

  @Column()
  occurredAt!: Date;

  constructor(args: CtorType) {
    super();
    if (args) {
      this.id = args.id;
      this.orderId = args.orderId;
      this.userId = args.userId;
      this.productId = args.productId;
      this.quantity = args.quantity;
      this.price = args.price;
      this.occurredAt = args.occurredAt;
    }
  }

  static of(args: CtorType) {
    return new OrderProductLogEntity(args);
  }
}
