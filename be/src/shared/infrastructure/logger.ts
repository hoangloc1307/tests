import pino from 'pino';
import { injectable } from 'tsyringe';
import type { Logger } from '~/shared/application/logger';
import { env, isDev } from '~/shared/infrastructure/env';

@injectable()
export class PinoLogger implements Logger {
  private pino = pino({
    level: 'info',
    ...(isDev() && {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
    }),
    base: {
      env: env.NODE_ENV,
    },
  });

  info(objOrMsg: object | string, msg?: string): void {
    if (typeof objOrMsg === 'string') {
      this.pino.info(objOrMsg);
    } else {
      this.pino.info(objOrMsg, msg);
    }
  }

  error(objOrMsg: object | string, msg?: string): void {
    if (typeof objOrMsg === 'string') {
      this.pino.error(objOrMsg);
    } else {
      this.pino.error(objOrMsg, msg);
    }
  }

  warn(objOrMsg: object | string, msg?: string): void {
    if (typeof objOrMsg === 'string') {
      this.pino.warn(objOrMsg);
    } else {
      this.pino.warn(objOrMsg, msg);
    }
  }
}
