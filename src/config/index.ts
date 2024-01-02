import { Store } from 'confidence';
import { ormconfig } from './ormconfig';

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
  aws: {
    accessKey: { $env: 'AWS_ACCESS_KEY' },
    secretAccessKey: { $env: 'AWS_SECRET_ACCESS_KEY' },
    region: { $env: 'AWS_REGION' },
    cloudwatch: {
      groupName: { $env: 'CLOUDWATCH_GROUP_NAME' },
      streamInfo: { $env: 'CLOUDWATCH_STREAM_INFO' },
      streamError: { $env: 'CLOUDWATCH_STREAM_ERROR' },
    },
  },
};

const store = new Store(config);

export const getConfig = (key: string) => store.get(key);
