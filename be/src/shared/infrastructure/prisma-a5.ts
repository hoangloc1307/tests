import { PrismaMssql } from '@prisma/adapter-mssql';
import { env } from '~/shared/infrastructure/env';
import { PrismaClient } from '../../../generated/a5/client';

const sqlConfig = {
  user: env.A5_DB_USER,
  password: env.A5_DB_PASSWORD,
  database: env.A5_DB_NAME,
  server: env.A5_DB_SERVER,
  port: env.A5_DB_PORT,
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
const prismaA5 = new PrismaClient({ adapter });

export { prismaA5 };
export type { PrismaClient as PrismaClientA5 };
