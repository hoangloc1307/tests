import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '~/shared/infrastructure/env';
import type { TokenPayload, TokenService } from '~/modules/auth/domain/token-service';

/** jsonwebtoken adapter implementing the TokenService port. */
export class JwtTokenService implements TokenService {
  signAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRY as SignOptions['expiresIn'],
    });
  }

  signRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRY as SignOptions['expiresIn'],
    });
  }

  verifyRefreshToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as jwt.JwtPayload;
    return { username: String(decoded.username) };
  }

  verifyAccessToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    return { username: String(decoded.username) };
  }
}
