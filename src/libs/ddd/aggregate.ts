import { Exclude } from 'class-transformer';
import { DomainEvent } from './event';

export abstract class Aggregate {
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
  @Exclude()
  version!: number;
}
