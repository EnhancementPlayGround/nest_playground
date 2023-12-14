import { DataSource } from 'typeorm';
import type { ApplicationService } from '../ddd/service';

export function Transactional() {
  return function (target: ApplicationService, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (this: ApplicationService, ...args: any[]) {
      let originalEntityManager;
      let result: any;

      try {
        await (this.dataSource as DataSource).transaction(async (entityManager) => {
          for (const key of Object.keys(this)) {
            // @ts-expect-error
            const repository = this[key];
            if (repository.manager) {
              originalEntityManager = repository.manager;
              repository.manager = entityManager;
            }
          }
          result = await originalMethod.apply(this, args);
        });
      } finally {
        for (const key of Object.keys(this)) {
          // @ts-expect-error
          const repository = this[key];
          if (repository.manager) {
            repository.manager = originalEntityManager;
          }
        }
      }

      return result;
    };
    return descriptor;
  };
}
