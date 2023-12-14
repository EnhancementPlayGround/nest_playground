import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class ApplicationService {
  @InjectDataSource() protected dataSource!: DataSource;
}
