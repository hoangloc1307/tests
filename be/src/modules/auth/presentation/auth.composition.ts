import { Router } from 'express';
import { loginSchema } from 'shared/schemas/auth';
import { AuthController } from '~/modules/auth/presentation/auth.controller';
import { authenticate } from '~/modules/auth/presentation/middlewares/authenticate';
import { container } from '~/shared/infrastructure/di/container';
import { requestValidator } from '~/shared/presentation/middlewares';

export const createAuthRouter = (): Router => {
  const controller = container.resolve(AuthController);

  const router = Router();
  router.post('/login', requestValidator(loginSchema), controller.login);
  router.post('/logout', authenticate, controller.logout);

  return router;
};
