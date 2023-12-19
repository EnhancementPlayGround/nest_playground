import { Exclude } from 'class-transformer';
import { CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export class Aggregate {
  @CreateDateColumn()
  @Exclude()
  private createdAt!: Date;

  @UpdateDateColumn()
  @Exclude()
  private updatedAt!: Date;
}

export class VersionedAggregate extends Aggregate {
  @VersionColumn({ default: 1 })
  @Exclude()
  private version!: number;
}
