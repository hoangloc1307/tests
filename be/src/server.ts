import http from 'http';
import 'reflect-metadata';
import { createApp } from '~/app';
import '~/shared/infrastructure/di/container';
import { env } from '~/shared/infrastructure/env';

const start = () => {
  const app = createApp();
  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    console.log(`Server running on: ${env.HOST}:${env.PORT}`);
  });
};

try {
  start();
} catch (err) {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
}
