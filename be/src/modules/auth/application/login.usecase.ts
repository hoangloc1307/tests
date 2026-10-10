import type { LoginInput } from 'shared/schemas/auth';
import { AppError } from '~/shared/domain/app-error';
import type { PasswordHasher } from '~/modules/auth/domain/password-hasher';
import type { TokenService } from '~/modules/auth/domain/token-service';
import type { UserRepository } from '~/modules/auth/domain/user.repository';
import type { LoginResult } from '~/modules/auth/application/dto';

/**
 * Login use case.
 *
 * Depends only on abstractions (UserRepository, PasswordHasher, TokenService).
 * It has no idea whether users come from Postgres or memory, how tokens are
 * signed, or what language the client speaks — it throws errors carrying an
 * i18n key and lets the presentation layer translate. That is the Dependency
 * Rule in action.
 */
export class LoginUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    const user = await this.users.findByUsername(input.username);

    if (!user || !user.canAuthenticate()) {
      throw AppError.unauthorized('auth:invalidCredentials');
    }

    const passwordMatches = await this.hasher.verify(user.passwordHash, input.password);
    if (!passwordMatches) {
      throw AppError.unauthorized('auth:invalidCredentials');
    }

    const accessToken = this.tokens.signAccessToken({ username: user.username });
    const refreshToken = this.tokens.signRefreshToken({ username: user.username });

    return {
      accessToken,
      refreshToken,
      user: { username: user.username, name: user.name },
    };
  }
}
