import { join } from 'path';
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

export default {
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
    // migrations: ['src/migration/**/*.ts'],
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
    // migrations: ['src/migration/**/*.ts'],
    supportBigNumbers: true,
    entities: [join(__dirname, '..', 'services', '**', 'domain', 'model.{ts,js}')],
    bigNumberStrings: false,
  },
  $default: {
    ...mysqlConfig,
    synchronize: false,
    // migrations: ['src/migration/**/*.ts'],
    supportBigNumbers: true,
    entities: [join(__dirname, '..', 'services', '**', 'domain', 'model.{ts,js}'), DomainEvent],
    bigNumberStrings: false,
  },
};
