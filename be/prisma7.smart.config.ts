import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const url = `sqlserver://${process.env.SMART_DB_SERVER};database=${process.env.SMART_DB_NAME};user=${process.env.SMART_DB_USER};password=${process.env.SMART_DB_PASSWORD};trustServerCertificate=true`;

export default defineConfig({
  schema: 'prisma/smart/schema.prisma',
  datasource: {
    url,
  },
});
