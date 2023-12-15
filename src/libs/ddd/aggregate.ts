import { Exclude } from 'class-transformer';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class Aggregate {
  @CreateDateColumn()
  @Exclude()
  private createdAt!: Date;

  @UpdateDateColumn()
  @Exclude()
  private updatedAt!: Date;
}
