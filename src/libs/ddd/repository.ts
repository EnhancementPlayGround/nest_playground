import { Injectable } from '@nestjs/common';
import { EntityManager, ObjectType } from 'typeorm';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import { optimisticLockVersionMismatch } from '../exceptions';
import { DomainEvent } from './event';
import { Aggregate, VersionedAggregate } from './aggregate';

@Injectable()
export abstract class Repository<T extends Aggregate> {
  protected abstract entityClass: ObjectType<T>;

  constructor(private entityManager: EntityManager, private eventEmitter: EventEmitter) {}

  getManager(): EntityManager {
    return this.entityManager;
  }

  async save(args: { target: T[]; transactionalEntityManager?: EntityManager }) {
    await (args.transactionalEntityManager ?? this.getManager()).save(args.target);
    await this.saveEvent(
      args.target.flatMap((entity) => entity.getPublishedEvents()),
      args.transactionalEntityManager,
    );
  }

  private async saveEvent(events: DomainEvent[], transactionalEntityManager?: EntityManager) {
    await (transactionalEntityManager ?? this.getManager()).save(DomainEvent, events);
    await Promise.all(events.map((event) => this.eventEmitter.emitAsync(event.type, event)));
  }
}

@Injectable()
export abstract class VersionedRepository<T extends VersionedAggregate> extends Repository<T> {
  protected abstract entityClass: ObjectType<T>;

  async save(args: { target: T[]; transactionalEntityManager?: EntityManager }) {
    const entityVersionOf = args.target.reduce((acc, entity) => {
      // @ts-expect-error
      acc[entity.id.toString()] = entity.version;
      return acc;
    }, {} as Record<string, number>);
    await super.save({ target: args.target, transactionalEntityManager: args.transactionalEntityManager });

    args.target
      .filter((entity) => entity.version > 1) // version === 1 이면 새로 생성한 entity 이므로 버젼 체크 할 필요 없음
      .forEach((entity) => {
        // @ts-expect-error
        if (entity.version !== entityVersionOf[entity.id.toString()] + 1) {
          // @ts-expect-error
          throw optimisticLockVersionMismatch(`${entity.constructor.name}(${entity.id})'s version is mismatched.`, {
            errorMessage: "Something went wrong and we couldn't complete your request.",
          });
        }
      });
  }
}
