import type { EntityManager } from 'typeorm';

export function injectTransactionalEntityManager(transactionalEntityManager: EntityManager) {
  return <T, M extends FunctionKeys<T>>(repository: T, methodName: M) =>
    async (
      ...args: T[M] extends (...args: infer U) => any ? U : never
    ): Promise<Awaited<T[M] extends (...args: any[]) => infer U ? U : never>> =>
      (repository[methodName] as (...args: unknown[]) => any)({
        // @ts-expect-error NOTE: 현재 repository method의 파라미터가 다양하여 transactionalEntityManager를 받으려면 객체 하나만 받아야한다.
        ...args[0],
        transactionalEntityManager,
      });
}
