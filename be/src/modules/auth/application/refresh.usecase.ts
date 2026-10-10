import { AppError } from '~/shared/domain/app-error';
import type { TokenService } from '~/modules/auth/domain/token-service';
import type { UserRepository } from '~/modules/auth/domain/user.repository';
import type { RefreshResult } from '~/modules/auth/application/dto';

/**
 * Refresh use case — exchanges a valid refresh token for a new access token.
 */
export class RefreshUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly tokens: TokenService,
  ) {}

  async execute(refreshToken: string): Promise<RefreshResult> {
    let payload;
    try {
      payload = this.tokens.verifyRefreshToken(refreshToken);
    } catch {
      throw AppError.unauthorized('auth:tokenExpired');
    }

    const user = await this.users.findByUsername(payload.username);
    if (!user || !user.canAuthenticate()) {
      throw AppError.unauthorized('auth:unauthorized');
    }

    return { accessToken: this.tokens.signAccessToken({ username: user.username }) };
  }
}
