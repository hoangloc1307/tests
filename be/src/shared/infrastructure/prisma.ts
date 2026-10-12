import { PrismaMssql } from '@prisma/adapter-mssql';
import { env } from '~/shared/infrastructure/env';
import { PrismaClient } from '../../../generated/prisma/client';

const sqlConfig = {
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  server: env.DB_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true,
    trustServerCertificate: true, // true for local dev / self-signed certs
  },
};

const adapter = new PrismaMssql(sqlConfig);
const prisma = new PrismaClient({ adapter });

export { prisma };
