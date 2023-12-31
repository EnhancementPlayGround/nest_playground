import { Column, Entity, PrimaryColumn } from 'typeorm';
import { VersionedAggregate } from '@libs/ddd';
import { badRequest } from '@libs/exceptions';

@Entity()
export class Product extends VersionedAggregate {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  price!: number;

  @Column()
  stock!: number;

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
