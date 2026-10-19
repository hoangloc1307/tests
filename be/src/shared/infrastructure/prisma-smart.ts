import { PrismaMssql } from '@prisma/adapter-mssql';
import { env } from '~/shared/infrastructure/env';
import { PrismaClient } from '../../../generated/smart/client';

const sqlConfig = {
  user: env.SMART_DB_USER,
  password: env.SMART_DB_PASSWORD,
  database: env.SMART_DB_NAME,
  server: env.SMART_DB_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const adapter = new PrismaMssql(sqlConfig);
const prismaSmart = new PrismaClient({ adapter });

export { prismaSmart };
export type { PrismaClient as PrismaClientSmart };
