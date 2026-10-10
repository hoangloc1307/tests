import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { corsConfig } from '~/shared/presentation/cors.config';
import { helmetConfig } from '~/shared/presentation/helmet.config';
import { errorHandler, languageDetector, notFoundHandler } from '~/shared/presentation/middlewares';
import { authenticate } from '~/modules/auth/presentation/middlewares';
import { buildModules } from '~/router';

export const createApp = async (): Promise<Express> => {
  const app = express();

  app.use(helmet(helmetConfig));
  app.use(cors(corsConfig));
  app.use(express.json());
  app.use(cookieParser());
  app.use(languageDetector);

  // Mount modules
  const modules = await buildModules();
  modules.forEach(({ path, router, isPublic }) => {
    if (isPublic) {
      app.use(`/api${path}`, router);
    } else {
      app.use(`/api${path}`, authenticate, router);
    }
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
