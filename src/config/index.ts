import { Store } from 'confidence';
import ormconfig from './ormconfig';

const config = {
  server: {
    url: {
      $env: 'ORIGIN',
      $default: 'http://localhost:3000',
    },
    port: {
      $env: 'PORT',
      $default: 3000,
    },
  },
  ormconfig,
  isProduction: {
    $filter: { $env: 'NODE_ENV' },
    production: true,
    $default: false,
  },
};

const store = new Store(config);

export const getConfig = (key: string) => store.get(key);
