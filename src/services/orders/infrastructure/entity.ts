import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '@libs/ddd';

type CtorType = {
  id: string;
  userId: string;
  totalAmount: number;
  lines: {
    productId: string;
    price: number;
    quantity: number;
  }[];
};

@Entity('order')
export class OrderEntity extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  userId!: string;

  @Column()
  totalAmount!: number;

  @OneToMany(() => OrderLineEntity, (orderLine) => orderLine.order, { cascade: true, eager: true })
  lines!: OrderLineEntity[];

  @DeleteDateColumn({ nullable: true })
  @Exclude()
  deletedAt!: Date;

  constructor(args: CtorType) {
    super();
    if (args) {
      this.id = args.id;
      this.userId = args.userId;
      this.totalAmount = args.totalAmount;
      this.lines = args.lines.map((line) => new OrderLineEntity(line));
    }
  }

  static of(args: CtorType) {
    return new OrderEntity(args);
  }
}

@Entity('order_line')
export class OrderLineEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id!: string;

  @Column()
  productId!: string;

  @Column()
  price!: number;

  @Column()
  quantity!: number;

  @DeleteDateColumn({ nullable: true })
  @Exclude()
  deletedAt!: Date;

  @ManyToOne(() => OrderEntity, (order) => order.lines)
  order!: never;

  constructor(args: { productId: string; price: number; quantity: number }) {
    if (args) {
      this.productId = args.productId;
      this.price = args.price;
      this.quantity = args.quantity;
    }
  }
}
