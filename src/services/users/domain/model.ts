import { nanoid } from 'nanoid';
import { Aggregate } from '@libs/ddd';

export class User extends Aggregate {
  id!: string;

  name!: string;

  constructor(args: { id?: string; name: string }) {
    super();
    if (args) {
      this.id = args.id ?? nanoid();
      this.name = args.name;
    }
  }
}
