import type { Request, Response } from 'express';
import type { LoginResponse } from 'shared/types/auth';
import { inject, injectable } from 'tsyringe';
import { CreateRoleUseCase } from '~/modules/auth/application/create-role.usecase';
import { DeleteRoleUseCase } from '~/modules/auth/application/delete-role.usecase';
import { ListRolesUseCase } from '~/modules/auth/application/list-roles.usecase';
import { LoginWithCardUseCase } from '~/modules/auth/application/login-with-card.usecase';
import { LoginUseCase } from '~/modules/auth/application/login.usecase';
import { UpdateRoleUseCase } from '~/modules/auth/application/update-role.usecase';
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
    private readonly loginWithCardUseCase: LoginWithCardUseCase,
    private readonly createUserRoleUseCase: CreateRoleUseCase,
    private readonly listRolesUseCase: ListRolesUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
    @inject(TOKENS.Translator) private readonly i18n: Translator,
  ) {}

  login = async (req: Request, res: Response) => {
    const { accessToken, refreshToken, user, roles, permissions, vnnToken } =
      await this.loginUseCase.execute(req.body);

    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isProd(),
      sameSite: 'lax',
      maxAge: REFRESH_MAX_AGE,
      path: REFRESH_COOKIE_PATH,
    });

    ApiResponse.ok<LoginResponse>(res, { token: accessToken, user, roles, permissions, vnnToken });
  };

  loginWithCard = async (req: Request, res: Response) => {
    const { accessToken, refreshToken, user, roles, permissions, vnnToken } =
      await this.loginWithCardUseCase.execute(req.body);

    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isProd(),
      sameSite: 'lax',
      maxAge: REFRESH_MAX_AGE,
      path: REFRESH_COOKIE_PATH,
    });

    ApiResponse.ok<LoginResponse>(res, { token: accessToken, user, roles, permissions, vnnToken });
  };

  logout = (_req: Request, res: Response) => {
    res.clearCookie(REFRESH_TOKEN_COOKIE, { path: REFRESH_COOKIE_PATH });
    ApiResponse.ok(res, null, this.i18n.t('auth:logoutSuccess'));
  };

  createRole = async (req: Request, res: Response) => {
    await this.createUserRoleUseCase.execute(
      {
        ...req.body,
        createdBy: req.user?.username as string,
      },
      req.authContext?.sections ?? [],
      req.authContext?.isSuperAdmin ?? false,
    );
    ApiResponse.created(res, null, this.i18n.t('auth:createRoleSuccess'));
  };

  listRoles = async (_req: Request, res: Response) => {
    const result = await this.listRolesUseCase.execute();
    ApiResponse.ok(res, result);
  };

  updateRole = async (req: Request, res: Response) => {
    await this.updateRoleUseCase.execute({
      ...req.body,
      updatedBy: req.user?.username as string,
    });
    ApiResponse.ok(res, null, this.i18n.t('auth:updateRoleSuccess'));
  };

  deleteRole = async (req: Request, res: Response) => {
    await this.deleteRoleUseCase.execute({
      id: req.body.id,
      updatedBy: req.user?.username as string,
    });
    ApiResponse.deleted(res);
  };
}
