import { VersionedAggregate } from '@libs/ddd';
import { badRequest } from '@libs/exceptions';
import { nanoid } from 'nanoid';

export class Product extends VersionedAggregate {
  id!: string;

  name!: string;

  price!: number;

  stock!: number;

  constructor(args: { id?: string; name: string; price: number; stock: number; version?: number }) {
    super();
    if (args) {
      this.id = args.id ?? nanoid();
      this.name = args.name;
      this.price = args.price;
      this.stock = args.stock;
      this.version = args.version ?? 1;
    }
  }

  static of(args: { id?: string; name: string; price: number; stock: number; version: number }) {
    return new Product(args);
  }

  ordered({ quantity }: { quantity: number }) {
    if (quantity > this.stock)
      throw badRequest(`Can not order(quantity:${quantity}) this product(${this.id}) more than stock(${this.stock})`, {
        errorMessage: '재고가 부족합니다.',
      });
    this.stock -= quantity;
  }

  cancel({ quantity }: { quantity: number }) {
    if (quantity <= 0) {
      throw badRequest(`Can not cancel(quantity:${quantity}) this product(${this.id}) less than 0`, {
        errorMessage: '취소할 수 없습니다.',
      });
    }
    this.stock += quantity;
  }
}
