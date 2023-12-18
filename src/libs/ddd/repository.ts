import { Injectable } from '@nestjs/common';
import { EntityManager, ObjectLiteral, ObjectType } from 'typeorm';
import { optimisticLockVersionMismatch } from '../exceptions';

@Injectable()
export abstract class Repository<T extends ObjectLiteral> {
  protected abstract entityClass: ObjectType<T>;

  constructor(private entityManager: EntityManager) {}

  protected getManager(): EntityManager {
    return this.entityManager;
  }

  async save(args: { target: T[]; transactionalEntityManager?: EntityManager }) {
    await (args.transactionalEntityManager ?? this.getManager()).save(args.target);
  }
}

@Injectable()
export abstract class VersionedRepository<T extends ObjectLiteral> extends Repository<T> {
  protected abstract entityClass: ObjectType<T>;

  async save(args: { target: T[]; transactionalEntityManager?: EntityManager }) {
    const entityVersionOf = args.target.reduce((acc, entity) => {
      acc[entity.id.toString()] = entity.version;
      return acc;
    }, {} as Record<string, number>);
    await super.save({ target: args.target, transactionalEntityManager: args.transactionalEntityManager });

    args.target
      .filter((entity) => entity.version > 1) // version === 1 이면 새로 생성한 entity 이므로 버젼 체크 할 필요 없음
      .forEach((entity) => {
        if (entity.version !== entityVersionOf[entity.id.toString()] + 1) {
          throw optimisticLockVersionMismatch(`${entity.constructor.name}(${entity.id})'s version is mismatched.`, {
            errorMessage: "Something went wrong and we couldn't complete your request.",
          });
        }
      });
  }
}
