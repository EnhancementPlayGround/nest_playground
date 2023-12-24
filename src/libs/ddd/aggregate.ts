import { Exclude } from 'class-transformer';
import { CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';
import { DomainEvent } from './event';

export abstract class Aggregate {
  @CreateDateColumn()
  @Exclude()
  private createdAt!: Date;

  @UpdateDateColumn()
  @Exclude()
  private updatedAt!: Date;

  @Exclude()
  private events: DomainEvent[] = [];

  protected publishEvent(event: DomainEvent) {
    this.events.push(event);
  }

  getPublishedEvents(): DomainEvent[] {
    return [...this.events];
  }
}

export class VersionedAggregate extends Aggregate {
  @VersionColumn({ default: 1 })
  @Exclude()
  version!: number;
}
