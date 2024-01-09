import { Injectable } from '@nestjs/common';
import { EntityManager, ObjectType } from 'typeorm';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import { DomainEvent } from './event';
import { Aggregate } from './aggregate';
import { BaseEntity } from './base-entity';

@Injectable()
export abstract class Repository<T extends BaseEntity> {
  protected abstract entityClass: ObjectType<T>;

  constructor(private entityManager: EntityManager, private eventEmitter: EventEmitter) {}

  getManager(): EntityManager {
    return this.entityManager;
  }

  abstract save(args: { target: Aggregate[]; transactionalEntityManager?: EntityManager }): Promise<void>;

  async saveEvent(args: { events: DomainEvent[]; transactionalEntityManager?: EntityManager }) {
    await (args.transactionalEntityManager ?? this.getManager()).save(DomainEvent, args.events);
    await Promise.all(args.events.map((event) => this.eventEmitter.emit(event.type, event)));
  }

  abstract remove(args: { target: Aggregate[]; transactionalEntityManager?: EntityManager }): Promise<void>;
}
