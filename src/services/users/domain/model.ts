import { Column, Entity, PrimaryColumn } from 'typeorm';
import { nanoid } from 'nanoid';
import { Aggregate } from '../../../libs/ddd';

@Entity()
export class User extends Aggregate {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  constructor(args: { name: string }) {
    super();
    if (args) {
      this.id = nanoid();
      this.name = args.name;
    }
  }
}
