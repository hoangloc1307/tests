import jwt, { type SignOptions } from 'jsonwebtoken';
import { injectable } from 'tsyringe';
import type { TokenPayload, TokenService } from '~/modules/auth/domain/token-service';
import { AppError } from '~/shared/domain/app-error';
import { env } from '~/shared/infrastructure/env';

@injectable()
export class JwtTokenService implements TokenService {
  signAccessToken(payload: TokenPayload): string {
    const tokenPayload: TokenPayload = { username: payload.username };
    if (payload.vnnToken) {
      tokenPayload.vnnToken = payload.vnnToken;
    }
    return jwt.sign(tokenPayload, env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRY,
    } as SignOptions);
  }

  verifyAccessToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    if (typeof decoded.username !== 'string' || decoded.username.length === 0) {
      throw AppError.unauthorized('auth:invalidToken');
    }
    const vnnToken = typeof decoded.vnnToken === 'string' ? decoded.vnnToken : undefined;
    return { username: decoded.username, vnnToken };
  }

  signRefreshToken(payload: TokenPayload): string {
    return jwt.sign({ username: payload.username }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRY,
    } as SignOptions);
  }

  verifyRefreshToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as jwt.JwtPayload;
    if (typeof decoded.username !== 'string' || decoded.username.length === 0) {
      throw AppError.unauthorized('auth:invalidToken');
    }
    return { username: decoded.username };
  }
}
