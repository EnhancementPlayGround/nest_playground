import { Column, Entity, PrimaryColumn } from 'typeorm';
import { nanoid } from 'nanoid';

@Entity()
export class User {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  constructor(args: { name: string }) {
    this.id = nanoid();
    this.name = args.name;
  }
}
