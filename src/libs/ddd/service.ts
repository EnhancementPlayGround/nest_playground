import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

export class ApplicationService {
  @InjectEntityManager() protected entityManager!: EntityManager;
}
