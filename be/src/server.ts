import http from 'http';
import app from '~/app';
import { env } from '~/configs';

const server = http.createServer(app);
server.listen(env.PORT, () => {
  console.log(`Server running on: ${env.HOST}:${env.PORT}`);
});
