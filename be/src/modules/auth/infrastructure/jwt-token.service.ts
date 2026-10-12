import jwt, { type SignOptions } from 'jsonwebtoken';
import { injectable } from 'tsyringe';
import type { TokenPayload, TokenService } from '~/modules/auth/domain/token-service';
import { env } from '~/shared/infrastructure/env';

@injectable()
export class JwtTokenService implements TokenService {
  signAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRY,
    } as SignOptions);
  }

  verifyAccessToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    return { username: String(decoded.username) };
  }

  signRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRY,
    } as SignOptions);
  }

  verifyRefreshToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as jwt.JwtPayload;
    return { username: String(decoded.username) };
  }
}
