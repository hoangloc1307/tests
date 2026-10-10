import { Router } from 'express';
import { changePasswordSchema, loginSchema } from 'shared/schemas/auth';
import { requestValidator } from '~/shared/presentation/middlewares';
import { I18nextTranslator } from '~/shared/infrastructure/i18n/i18next.translator';
import { authenticate } from '~/modules/auth/presentation/middlewares';
import { ChangePasswordUseCase } from '~/modules/auth/application/change-password.usecase';
import { LoginUseCase } from '~/modules/auth/application/login.usecase';
import { RefreshUseCase } from '~/modules/auth/application/refresh.usecase';
import { Argon2PasswordHasher } from '~/modules/auth/infrastructure/argon2-password.hasher';
import { InMemoryUserRepository } from '~/modules/auth/infrastructure/in-memory-user.repository';
import { JwtTokenService } from '~/modules/auth/infrastructure/jwt-token.service';
import { AuthController } from '~/modules/auth/presentation/auth.controller';

/**
 * Composition root for the auth module.
 *
 * This is the ONLY place where concrete infrastructure is chosen and injected
 * into the use cases. To move from the in-memory store to Prisma later, swap
 * `InMemoryUserRepository` for a `PrismaUserRepository` here — nothing in the
 * domain, application, or presentation layers changes.
 */
export const createAuthRouter = async (): Promise<Router> => {
  // Infrastructure adapters (implement the ports)
  const hasher = new Argon2PasswordHasher();
  const tokenService = new JwtTokenService();
  const translator = new I18nextTranslator();
  const userRepository = await InMemoryUserRepository.seeded(hasher);

  // Application use cases (depend on ports only — no translator; they throw
  // errors carrying i18n keys that the errorHandler resolves)
  const loginUseCase = new LoginUseCase(userRepository, hasher, tokenService);
  const refreshUseCase = new RefreshUseCase(userRepository, tokenService);
  const changePasswordUseCase = new ChangePasswordUseCase(userRepository, hasher);

  // Presentation
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
