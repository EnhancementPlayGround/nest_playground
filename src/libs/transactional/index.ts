import type { ApplicationService } from '../ddd/service';

export function Transactional() {
  return function (target: ApplicationService, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (this: ApplicationService, ...args: any[]) {
      let result: any;

      await this.entityManager.transaction(async (entityManager) => {
        for (const key of Object.keys(this)) {
          // @ts-expect-error
          const repository = this[key];
          if (repository.entityManager) {
            repository.entityManager = entityManager;
          }
        }
        result = await originalMethod.apply(this, args);
      });

      for (const key of Object.keys(this)) {
        // @ts-expect-error
        const repository = this[key];
        if (repository.entityManager) {
          repository.entityManager = repository.entityManager.queryRunner.isReleased
            ? this.entityManager
            : repository.entityManager;
        }
      }

      return result;
    };
    return descriptor;
  };
}
