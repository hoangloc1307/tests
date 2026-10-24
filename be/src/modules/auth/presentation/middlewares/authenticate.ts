import type { NextFunction, Request, Response } from 'express';
import type { TokenService } from '~/modules/auth/domain/token-service';
import { AppError } from '~/shared/domain/app-error';
import { container } from '~/shared/infrastructure/di/container';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const tokenService = container.resolve<TokenService>(TOKENS.TokenService);
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    next(AppError.unauthorized('auth:unauthorized'));
    return;
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const payload = tokenService.verifyAccessToken(token);
    req.user = { username: payload.username, vnnToken: payload.vnnToken };
    next();
  } catch {
    next(AppError.unauthorized('auth:tokenExpired'));
  }
};
