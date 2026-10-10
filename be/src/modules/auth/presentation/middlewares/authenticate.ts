import type { NextFunction, Request, Response } from 'express';
import { AppError } from '~/shared/domain/app-error';
import { JwtTokenService } from '~/modules/auth/infrastructure/jwt-token.service';

const tokenService = new JwtTokenService();

/** Verifies the Bearer access token and attaches the user to the request. */
export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    next(AppError.unauthorized('auth:unauthorized'));
    return;
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const payload = tokenService.verifyAccessToken(token);
    req.user = { username: payload.username };
    next();
  } catch {
    next(AppError.unauthorized('auth:tokenExpired'));
  }
};
