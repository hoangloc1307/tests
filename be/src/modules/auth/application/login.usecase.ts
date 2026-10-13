import type { LoginInput } from 'shared/schemas/auth';
import { inject, injectable } from 'tsyringe';
import type { LoginResult } from '~/modules/auth/application/dto';
import type { PasswordVerifier } from '~/modules/auth/domain/password-hasher';
import type { TokenService } from '~/modules/auth/domain/token-service';
import type { UserRepository } from '~/modules/auth/domain/user.repository';
import { AppError } from '~/shared/domain/app-error';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

@injectable()
export class LoginUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private readonly users: UserRepository,
    @inject(TOKENS.PasswordVerifier) private readonly verifier: PasswordVerifier,
    @inject(TOKENS.TokenService) private readonly tokens: TokenService,
  ) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    const user = await this.users.findByUsername(input.username);

    if (!user || !user.canAuthenticate()) {
      throw AppError.unauthorized('auth:invalidCredentials');
    }

    const passwordMatches = this.verifier.verify(
      user.passwordHash,
      user.securityStamp,
      input.password,
    );
    if (!passwordMatches) {
      throw AppError.unauthorized('auth:invalidCredentials');
    }

    const accessToken = this.tokens.signAccessToken({ username: user.username });
    const refreshToken = this.tokens.signRefreshToken({ username: user.username });

    return {
      accessToken,
      refreshToken,
      user: { username: user.username, name: user.displayName ?? user.username },
    };
  }
}
