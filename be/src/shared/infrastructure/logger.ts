import pino from 'pino';
import { env, isDev } from '~/shared/infrastructure/env';

export const logger = pino({
  level: isDev() ? 'debug' : 'info',
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
