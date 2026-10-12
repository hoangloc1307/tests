import { Router } from 'express';
import { changePasswordSchema, loginSchema } from 'shared/schemas/auth';
import { ChangePasswordUseCase } from '~/modules/auth/application/change-password.usecase';
import { LoginUseCase } from '~/modules/auth/application/login.usecase';
import { RefreshUseCase } from '~/modules/auth/application/refresh.usecase';
import { Argon2PasswordHasher } from '~/modules/auth/infrastructure/argon2-password.hasher';
import { JwtTokenService } from '~/modules/auth/infrastructure/jwt-token.service';
import { PrismaUserRepository } from '~/modules/auth/infrastructure/prisma-user.repository';
import { AuthController } from '~/modules/auth/presentation/auth.controller';
import { authenticate } from '~/modules/auth/presentation/middlewares/authenticate';
import { I18nextTranslator } from '~/shared/infrastructure/i18n/i18next.translator';
import { requestValidator } from '~/shared/presentation/middlewares';

export const createAuthRouter = async (): Promise<Router> => {
  const hasher = new Argon2PasswordHasher();
  const tokenService = new JwtTokenService();
  const translator = new I18nextTranslator();
  const userRepository = new PrismaUserRepository();

  const loginUseCase = new LoginUseCase(userRepository, hasher, tokenService);
  const refreshUseCase = new RefreshUseCase(userRepository, tokenService);
  const changePasswordUseCase = new ChangePasswordUseCase(userRepository, hasher);

  const controller = new AuthController(
    loginUseCase,
    refreshUseCase,
    changePasswordUseCase,
    translator,
  );

  const router = Router();
  router.post('/login', requestValidator(loginSchema), controller.login);
  router.post('/refresh', controller.refresh);
  router.post('/logout', authenticate, controller.logout);
  router.put(
    '/change-password',
    authenticate,
    requestValidator(changePasswordSchema),
    controller.changePassword,
  );

  return router;
};
