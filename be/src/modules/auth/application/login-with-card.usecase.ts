import type { LoginWithCardInput } from 'shared/schemas/auth';
import { inject, injectable } from 'tsyringe';
import type { LoginResult } from '~/modules/auth/application/dto';
import type { AuthClient } from '~/modules/auth/domain/auth-client';
import type { HrClient } from '~/modules/auth/domain/hr-client';
import type { PermissionClient } from '~/modules/auth/domain/permission-client';
import type { TokenService } from '~/modules/auth/domain/token-service';
import { TOKENS } from '~/shared/infrastructure/di/tokens';
import { env } from '~/shared/infrastructure/env';

@injectable()
export class LoginWithCardUseCase {
  constructor(
    @inject(TOKENS.AuthClient) private readonly authClient: AuthClient,
    @inject(TOKENS.HrClient) private readonly hrClient: HrClient,
    @inject(TOKENS.PermissionClient) private readonly permissionClient: PermissionClient,
    @inject(TOKENS.TokenService) private readonly tokens: TokenService,
  ) {}

  async execute(input: LoginWithCardInput): Promise<LoginResult> {
    const [employee, account] = await Promise.all([
      this.hrClient.getEmployeeByCardNumber(input.cardNumber),
      this.authClient.login({
        username: env.A5_WORKER_USERNAME,
        password: env.A5_WORKER_PASSWORD,
      }),
    ]);
    const permissions = await this.permissionClient.getUserPermissions(account.id);

    const accessToken = this.tokens.signAccessToken({ username: employee.employeeId });
    const refreshToken = this.tokens.signRefreshToken({ username: employee.employeeId });

    return {
      accessToken,
      refreshToken,
      user: {
        username: employee.employeeId,
        name: employee.name,
      },
      roles: (permissions?.[0]?.roles ?? []).map((role) => ({
        role,
        section: employee.sectionId,
      })),
      permissions: permissions?.[0]?.permissions ?? [],
      vnnToken: account.token,
    };
  }
}
