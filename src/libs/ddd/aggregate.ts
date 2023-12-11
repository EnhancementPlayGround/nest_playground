import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class Aggregate {
  @CreateDateColumn()
  private createdAt!: Date;

  @UpdateDateColumn()
  private updatedAt!: Date;
}
