import { Exclude } from 'class-transformer';
import { CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn()
  @Exclude()
  private createdAt!: Date;

  @UpdateDateColumn()
  @Exclude()
  private updatedAt!: Date;
}

export abstract class VersionedEntity extends BaseEntity {
  @VersionColumn({ default: 1 })
  @Exclude()
  version!: number;
}
