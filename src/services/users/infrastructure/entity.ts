import { Column, Entity, PrimaryColumn } from 'typeorm';
import { nanoid } from 'nanoid';
import { BaseEntity } from '@libs/ddd';

@Entity('user')
export class UserEntity extends BaseEntity {
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
