import http from 'http';
import { createApp } from '~/app';
import { env } from '~/shared/infrastructure/env';

const start = async () => {
  const app = await createApp();
  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    console.log(`Server running on: ${env.HOST}:${env.PORT}`);
  });
};

start().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
