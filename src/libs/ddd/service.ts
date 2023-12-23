import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';

export abstract class ApplicationService {
  @InjectDataSource() protected dataSource!: DataSource;
}
