import type { EntityManager } from 'typeorm';

export function injectTransactionalEntityManager(transactionalEntityManager: EntityManager) {
  return <T extends (...args: any[]) => any>(f: T) =>
    async <U extends Parameters<T>>(...args: U): Promise<ReturnType<T>> =>
      f({ ...args[0], transactionalEntityManager });
}
