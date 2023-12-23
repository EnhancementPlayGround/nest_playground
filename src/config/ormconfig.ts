import { join } from 'path';
import { DataSource } from 'typeorm';
import { DomainEvent } from '../libs/ddd/event';

const mysqlConfig = {
  type: 'mysql',
  host: { $env: 'DB_HOST' },
  port: { $env: 'DB_PORT' },
  database: { $env: 'DB_NAME' },
  username: { $env: 'DB_USER' },
  password: { $env: 'DB_PASSWORD' },
  timezone: 'UTC+0',
};

export const ormconfig = {
  $filter: { $env: 'NODE_ENV' },
  production: {
    ...mysqlConfig,
    synchronize: false,
    // migrations: ['src/migration/**/*.ts'],
    supportBigNumbers: true,
    entities: [join(__dirname, '..', 'services', '**', 'domain', 'model.{ts,js}'), DomainEvent],
    bigNumberStrings: false,
  },
  development: {
    ...mysqlConfig,
    synchronize: true,
    // migrations: ['dist/src/migrations/*.js'],
    supportBigNumbers: true,
    entities: [join(__dirname, '..', 'services', '**', 'domain', 'model.{ts,js}'), DomainEvent],
    bigNumberStrings: false,
    logging: true,
  },
  test: {
    type: 'mysql',
    host: 'localhost',
    port: 3307,
    database: 'test',
    username: 'root',
    password: '1234',
    synchronize: false,
    migrations: ['src/migrations/*{.ts,.js}'],
    supportBigNumbers: true,
    entities: [join(__dirname, '..', 'services', '**', 'domain', 'model.{ts,js}')],
    bigNumberStrings: false,
  },
  $default: {
    ...mysqlConfig,
    synchronize: false,
    migrations: ['dist/src/migrations/*.js'],
    supportBigNumbers: true,
    entities: [join(__dirname, '..', 'services', '**', 'domain', 'model.{ts,js}'), DomainEvent],
    bigNumberStrings: false,
  },
};

// @ts-expect-error
const dataSourceForMigration = new DataSource(ormconfig[process.env.NODE_ENV || '$default']);

export default dataSourceForMigration;
