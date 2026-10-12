import type { Request, Response } from 'express';
import type { LoginResponse } from 'shared/types/auth';
import { inject, injectable } from 'tsyringe';
import { LoginUseCase } from '~/modules/auth/application/login.usecase';
import type { Translator } from '~/shared/application/translator';
import { TOKENS } from '~/shared/infrastructure/di/tokens';
import { isProd } from '~/shared/infrastructure/env';
import { ApiResponse } from '~/shared/presentation/api-response';

const REFRESH_TOKEN_COOKIE = 'rt';
const REFRESH_COOKIE_PATH = '/api/auth/refresh';
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

@injectable()
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    @inject(TOKENS.Translator) private readonly i18n: Translator,
  ) {}

  login = async (req: Request, res: Response) => {
    const { accessToken, refreshToken, user } = await this.loginUseCase.execute(req.body);

    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isProd(),
      sameSite: 'lax',
      maxAge: REFRESH_MAX_AGE,
      path: REFRESH_COOKIE_PATH,
    });

    ApiResponse.ok<LoginResponse>(res, { token: accessToken, user });
  };

  logout = (_req: Request, res: Response) => {
    res.clearCookie(REFRESH_TOKEN_COOKIE, { path: REFRESH_COOKIE_PATH });
    ApiResponse.ok(res, null, this.i18n.t('auth:logoutSuccess'));
  };
}
