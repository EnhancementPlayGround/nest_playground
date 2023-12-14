import { Injectable } from '@nestjs/common';
import { EntityManager, ObjectLiteral, ObjectType } from 'typeorm';

@Injectable()
export abstract class Repository<T extends ObjectLiteral> {
  protected abstract entityClass: ObjectType<T>;

  constructor(private manager: EntityManager) {}

  protected getManager(): EntityManager {
    return this.manager;
  }

  async save(entity: T[]) {
    return this.manager.save(entity, { reload: true });
  }
}
