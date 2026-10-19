import dotenv from 'dotenv';
import path from 'path';
import z from 'zod';

const envSchema = z.object({
  // ==================== APP ====================
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  HOST: z.url({ error: 'Must be a valid URL.' }),
  PORT: z.coerce
    .number({ error: 'Must be a number.' })
    .int({ error: 'Must be an integer.' })
    .min(1, { error: 'Must be greater than 0.' })
    .max(65535, { error: 'Must be less than 65536.' }),

  // ==================== DATABASE ====================
  // SMART Database
  SMART_DB_SERVER: z.string().min(1, { error: 'SMART_DB_SERVER is required.' }),
  SMART_DB_NAME: z.string().min(1, { error: 'SMART_DB_NAME is required.' }),
  SMART_DB_USER: z.string().min(1, { error: 'SMART_DB_USER is required.' }),
  SMART_DB_PASSWORD: z.string().min(1, { error: 'SMART_DB_PASSWORD is required.' }),

  // A5 Database
  A5_DB_SERVER: z.string().min(1, { error: 'A5_DB_SERVER is required.' }),
  A5_DB_NAME: z.string().min(1, { error: 'A5_DB_NAME is required.' }),
  A5_DB_USER: z.string().min(1, { error: 'A5_DB_USER is required.' }),
  A5_DB_PASSWORD: z.string().min(1, { error: 'A5_DB_PASSWORD is required.' }),

  // ==================== THIRD PARTY ====================
  AUTH_ENDPOINT: z.url({ error: 'AUTH_ENDPOINT must be a valid URL.' }),
  HR_ENDPOINT: z.url({ error: 'HR_ENDPOINT must be a valid URL.' }),
  VNN_MASTER_ENDPOINT: z.url({ error: 'VNN_MASTER_ENDPOINT must be a valid URL.' }),
  A5_TENANT_ID: z.string().uuid({ error: 'A5_TENANT_ID must be a valid UUID.' }),
  A5_WORKER_USERNAME: z.string().min(1, { error: 'A5_WORKER_USERNAME is required.' }),
  A5_WORKER_PASSWORD: z.string().min(1, { error: 'A5_WORKER_PASSWORD is required.' }),

  // ==================== FLOWABLE ====================
  FLOWABLE_ENDPOINT: z.url({ error: 'FLOWABLE_ENDPOINT must be a valid URL.' }),
  FLOWABLE_USER: z.string().min(1, { error: 'FLOWABLE_USER is required.' }),
  FLOWABLE_PASSWORD: z.string().min(1, { error: 'FLOWABLE_PASSWORD is required.' }),

  // ==================== JWT ====================
  JWT_SECRET: z.string().min(1, { error: 'JWT_SECRET is required.' }),
  JWT_REFRESH_SECRET: z.string().min(1, { error: 'JWT_REFRESH_SECRET is required.' }),
  JWT_ACCESS_EXPIRY: z.string().min(1, { error: 'JWT_ACCESS_EXPIRY is required.' }),
  JWT_REFRESH_EXPIRY: z.string().min(1, { error: 'JWT_REFRESH_EXPIRY is required.' }),

  // ==================== SMTP ====================
  SMTP_ENABLED: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),
  SMTP_HOST: z.string().min(1, { error: 'SMTP_HOST is required.' }),
  SMTP_PORT: z.coerce.number({ error: 'SMTP_PORT must be a number.' }),
  SMTP_SECURE: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().min(1, { error: 'SMTP_FROM is required.' }),
});

const NODE_ENV = process.env.NODE_ENV;

if (!NODE_ENV) {
  console.error('❌ NODE_ENV is not defined.');
  process.exit(1);
}

dotenv.config({ path: path.resolve(process.cwd(), `.env.${NODE_ENV}`) });

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment configuration:');
  console.error(z.prettifyError(parsedEnv.error));
  process.exit(1);
}

export const env = Object.freeze(parsedEnv.data);

export const isProd = () => env.NODE_ENV === 'production';
export const isDev = () => env.NODE_ENV === 'development';
export const isTest = () => env.NODE_ENV === 'test';
