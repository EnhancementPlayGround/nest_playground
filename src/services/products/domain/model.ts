import { Column, Entity, PrimaryColumn } from 'typeorm';
import { VersionedAggregate } from '../../../libs/ddd';

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
}
