import { Router } from 'express';
import { ENDPOINTS } from 'shared/constants/endpoints';
import { loginSchema, loginWithCardSchema } from 'shared/schemas/auth';
import { AuthController } from '~/modules/auth/presentation/auth.controller';
import { authenticate } from '~/modules/auth/presentation/middlewares/authenticate';
import { container } from '~/shared/infrastructure/di/container';
import { requestValidator } from '~/shared/presentation/middlewares';

export const createAuthRouter = (): Router => {
  const controller = container.resolve(AuthController);
  const router = Router();

  router.post(ENDPOINTS.AUTH.LOGIN, requestValidator(loginSchema), controller.login);

  router.post(
    ENDPOINTS.AUTH.LOGIN_WITH_CARD,
    requestValidator(loginWithCardSchema),
    controller.loginWithCard,
  );

  router.post(ENDPOINTS.AUTH.LOGOUT, authenticate, controller.logout);

  return router;
};
