import type { LoginInput } from 'shared/schemas/auth';
import { inject, injectable } from 'tsyringe';
import type { LoginResult } from '~/modules/auth/application/dto';
import type { AuthClient } from '~/modules/auth/domain/auth-client';
import type { PermissionClient } from '~/modules/auth/domain/permission-client';
import type { TokenService } from '~/modules/auth/domain/token-service';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

@injectable()
export class LoginUseCase {
  constructor(
    @inject(TOKENS.AuthClient) private readonly authClient: AuthClient,
    @inject(TOKENS.PermissionClient) private readonly permissionClient: PermissionClient,
    @inject(TOKENS.TokenService) private readonly tokens: TokenService,
  ) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    const account = await this.authClient.login(input);
    const permission = await this.permissionClient.getUserPermissions(account.id);

    const accessToken = this.tokens.signAccessToken({ username: account.username });
    const refreshToken = this.tokens.signRefreshToken({ username: account.username });

    return {
      accessToken,
      refreshToken,
      user: {
        username: account.username,
        name: account.displayName,
      },
    };
  }
}
