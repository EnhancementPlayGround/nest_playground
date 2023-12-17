import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { nanoid } from 'nanoid';
import { Aggregate } from '../../../libs/ddd';
import type { CalculateOrderService } from './services';
import type { Product } from '../../products/domain/model';

type CtorType = {
  userId: string;
  totalAmount: number;
  lines: {
    productId: string;
    price: number;
    quantity: number;
  }[];
};

@Entity()
export class Order extends Aggregate {
  @PrimaryColumn()
  id!: string;

  @Column()
  userId!: string;

  @Column()
  totalAmount!: number;

  @OneToMany(() => OrderLine, (orderLine) => orderLine.order)
  lines!: OrderLine[];

  constructor(args: CtorType) {
    super();
    if (args) {
      this.id = nanoid();
      this.userId = args.userId;
      this.totalAmount = args.totalAmount;
      this.lines = args.lines.map((line) => new OrderLine(line));
    }
  }

  static from(args: {
    userId: string;
    lines: { productId: string; quantity: number }[];
    calculateOrderService: CalculateOrderService;
    products: Product[];
  }) {
    const { totalAmount, lines } = args.calculateOrderService.calculate({
      orderLines: args.lines,
      products: args.products,
    });
    return new Order({
      userId: args.userId,
      lines,
      totalAmount,
    });
  }
}

@Entity()
export class OrderLine {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  productId!: string;

  @Column()
  price!: number;

  @Column()
  quantity!: number;

  @ManyToOne(() => Order, (order) => order.lines)
  order!: never;

  constructor(args: { productId: string; price: number; quantity: number }) {
    if (args) {
      this.productId = args.productId;
      this.price = args.price;
      this.quantity = args.quantity;
    }
  }
}
