import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, ObjectLiteral, ObjectType } from 'typeorm';

export abstract class Repository<T extends ObjectLiteral> {
  protected abstract entityClass: ObjectType<T>;

  @InjectEntityManager() private entityManager!: EntityManager;

  protected getManager(): EntityManager {
    return this.entityManager;
  }

  async save(entities: T[]) {
    return this.entityManager.save(entities);
  }
}
