import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';

export class ApplicationService {
  @InjectDataSource() protected dataSource!: DataSource;
}
