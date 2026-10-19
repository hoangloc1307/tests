import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const url = `sqlserver://${process.env.A5_DB_SERVER};database=${process.env.A5_DB_NAME};user=${process.env.A5_DB_USER};password=${process.env.A5_DB_PASSWORD};trustServerCertificate=true`;

export default defineConfig({
  schema: 'prisma/a5/schema.prisma',
  datasource: {
    url,
  },
});
