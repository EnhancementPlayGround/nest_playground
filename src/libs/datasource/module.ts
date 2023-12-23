import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from '../../config';

@Module({ imports: [TypeOrmModule.forRoot(getConfig('/ormconfig'))] })
export class DatabaseModule {}
