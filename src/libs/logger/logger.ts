import * as winston from 'winston';
import * as process from 'process';
import { CloudwatchLoggerAddon } from './cloud-watch-addon';
import { getConfig } from '../../config';

const { createLogger, transports } = winston;
const { combine, timestamp, colorize, printf } = winston.format;

const isProd = getConfig('/isProduction');
class Logger {
  private logger: winston.Logger;

  private cloudwatchAddon!: CloudwatchLoggerAddon;

  constructor() {
    // send to cloudWatch
    this.logger = createLogger({
      level: isProd ? 'info' : 'silly',
    });

    // cloudWatch log setup
    if (isProd) {
      this.cloudwatchAddon = new CloudwatchLoggerAddon();

      this.logger.add(
        new transports.Console({
          format: combine(
            colorize(),
            timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            printf((info) => {
              return `[${info.timestamp}] [${process.env.NODE_ENV}] [${info.level}] [HTTP] : ${info.message}`;
            }),
          ),
        }),
      );
    } else {
      this.logger.add(
        new transports.Console({
          format: combine(
            colorize(),
            timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            printf((info) => {
              return `[${info.timestamp}] [${info.level}] [HTTP] : ${info.message}`;
            }),
          ),
        }),
      );
    }
  }

  public debug(debugMsg: string, metadata = '') {
    this.logger.debug(`${debugMsg}-${metadata}`);
  }

  public info(msg: string, metadata = '') {
    this.logger.info(`${msg} - ${metadata}`);
    if (isProd) {
      const info = {
        timestamp: new Date().toISOString(),
        level: 'info',
        category: 'HTTP',
        message: msg,
        metadata,
      };
      this.cloudwatchAddon.sendInfo(info);
    }
  }

  public error(errMsg: Error | string, metadata = '') {
    console.log(
      '!!!',
      getConfig('/aws/accessKeyId'),
      getConfig('/aws/secretAccessKey'),
      getConfig('/aws/region'),
      getConfig('/aws/cloudwatch/groupName'),
      getConfig('/aws/cloudwatch/streamInfo'),
      getConfig('/aws/cloudwatch/streamError'),
    );
    if (errMsg instanceof Error) {
      const err = errMsg.stack ? errMsg.stack : errMsg.message;
      this.logger.error(`${err}\n======================================\nmetadata: ${metadata}`); // this will now log the error stack trace
    } else {
      this.logger.error(`${errMsg}\n======================================\nmetadata: ${metadata}`);
    }
    if (isProd) {
      const message = {
        timestamp: new Date().toISOString(),
        level: 'error',
        category: 'HTTP',
        // eslint-disable-next-line no-nested-ternary
        message: errMsg instanceof Error ? (errMsg.stack ? errMsg.stack : errMsg.message) : errMsg,
        metadata,
      };
      this.cloudwatchAddon.sendError(message);
    }
  }

  public warn(warnMsg: string, metadata = '') {
    this.logger.warn(warnMsg);
    if (isProd) {
      const message = {
        timestamp: new Date().toISOString(),
        level: 'debug',
        category: 'HTTP',
        message: warnMsg,
        metadata,
      };
      this.cloudwatchAddon.sendError(message);
    }
  }
}

export const logger = new Logger();
