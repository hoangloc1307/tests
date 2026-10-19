import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const url = `postgresql://${process.env.QIM_DB_USER}:${process.env.QIM_DB_PASSWORD}@${process.env.QIM_DB_HOST}:${process.env.QIM_DB_PORT}/${process.env.QIM_DB_NAME}`;

export default defineConfig({
  schema: 'prisma/qim/schema.prisma',
  datasource: {
    url,
  },
});
