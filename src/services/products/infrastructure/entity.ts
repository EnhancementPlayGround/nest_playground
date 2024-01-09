import { Column, Entity, PrimaryColumn } from 'typeorm';
import { VersionedEntity } from '@libs/ddd';

@Entity('product')
export class ProductEntity extends VersionedEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  price!: number;

  @Column()
  stock!: number;

  constructor(args: { id: string; name: string; price: number; stock: number; version: number }) {
    super();
    if (args) {
      this.id = args.id;
      this.name = args.name;
      this.price = args.price;
      this.stock = args.stock;
      this.version = args.version;
    }
  }

  static of(args: { id: string; name: string; price: number; stock: number; version: number }) {
    return new ProductEntity(args);
  }
}
