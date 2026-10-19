import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '~/shared/infrastructure/env';
import { PrismaClient } from '../../../generated/qim/client';

const connectionString = `postgresql://${env.QIM_DB_USER}:${env.QIM_DB_PASSWORD}@${env.QIM_DB_HOST}:${env.QIM_DB_PORT}/${env.QIM_DB_NAME}`;

const adapter = new PrismaPg({ connectionString });
const prismaQim = new PrismaClient({ adapter });

export { prismaQim };
export type { PrismaClient as PrismaClientQim };
