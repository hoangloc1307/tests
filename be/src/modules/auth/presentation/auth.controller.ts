import type { Request, Response } from 'express';
import type { LoginResponse, RefreshResponse } from 'shared/types/auth';
import { AppError } from '~/shared/domain/app-error';
import type { Translator } from '~/shared/application/translator';
import { env } from '~/shared/infrastructure/env';
import { ApiResponse } from '~/shared/presentation/api-response';
import type { LoginUseCase } from '~/modules/auth/application/login.usecase';
import type { RefreshUseCase } from '~/modules/auth/application/refresh.usecase';
import type { ChangePasswordUseCase } from '~/modules/auth/application/change-password.usecase';

const REFRESH_TOKEN_COOKIE = 'refreshToken';
const REFRESH_COOKIE_PATH = '/api/auth/refresh';
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

/**
 * Presentation adapter. Translates HTTP <-> use cases. It holds no business
 * logic; it only parses the request, invokes a use case, and shapes the response.
 */
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshUseCase: RefreshUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly i18n: Translator,
  ) {}

  login = async (req: Request, res: Response) => {
    const { accessToken, refreshToken, user } = await this.loginUseCase.execute(req.body);

    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_MAX_AGE,
      path: REFRESH_COOKIE_PATH,
    });

    ApiResponse.ok<LoginResponse>(
      res,
      { token: accessToken, user },
      this.i18n.t('auth:loginSuccess'),
    );
  };

  refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined;

    if (!refreshToken) {
      throw AppError.unauthorized('auth:tokenExpired');
    }

    const { accessToken } = await this.refreshUseCase.execute(refreshToken);
    ApiResponse.ok<RefreshResponse>(res, { token: accessToken });
  };

  logout = (_req: Request, res: Response) => {
    res.clearCookie(REFRESH_TOKEN_COOKIE, { path: REFRESH_COOKIE_PATH });
    ApiResponse.ok(res, null, this.i18n.t('auth:logoutSuccess'));
  };

  changePassword = async (req: Request, res: Response) => {
    const username = req.user!.username;
    await this.changePasswordUseCase.execute(username, req.body);
    ApiResponse.ok(res, null, this.i18n.t('auth:changePasswordSuccess'));
  };
}
