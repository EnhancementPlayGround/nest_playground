import { Injectable } from '@nestjs/common';
import { EntityManager, ObjectLiteral, ObjectType } from 'typeorm';

@Injectable()
export abstract class Repository<T extends ObjectLiteral> {
  protected abstract entityClass: ObjectType<T>;

  constructor(private entityManager: EntityManager) {}

  protected getManager(): EntityManager {
    return this.entityManager;
  }

  async save(args: { target: T[]; transactionalEntityManager?: EntityManager }) {
    return (args.transactionalEntityManager ?? this.entityManager).save(args.target);
  }
}
