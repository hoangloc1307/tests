import type { LoginWithCardInput } from 'shared/schemas/auth';
import { inject, injectable } from 'tsyringe';
import type { LoginResult } from '~/modules/auth/application/dto';
import type { HrClient } from '~/modules/auth/domain/hr-client';
import type { PermissionClient } from '~/modules/auth/domain/permission-client';
import type { TokenService } from '~/modules/auth/domain/token-service';
import { TOKENS } from '~/shared/infrastructure/di/tokens';
import { env } from '~/shared/infrastructure/env';

@injectable()
export class LoginWithCardUseCase {
  constructor(
    @inject(TOKENS.HrClient) private readonly hrClient: HrClient,
    @inject(TOKENS.PermissionClient) private readonly permissionClient: PermissionClient,
    @inject(TOKENS.TokenService) private readonly tokens: TokenService,
  ) {}

  async execute(input: LoginWithCardInput): Promise<LoginResult> {
    // Lấy thông tin nhân viên từ HR bằng số thẻ
    const employee = await this.hrClient.getEmployeeByCardNumber(input.cardNumber);
    const permissions = await this.permissionClient.getUserPermissions(env.A5_WORKER_ID);

    const accessToken = this.tokens.signAccessToken({ username: employee.employeeId });
    const refreshToken = this.tokens.signRefreshToken({ username: employee.employeeId });

    return {
      accessToken,
      refreshToken,
      user: {
        username: employee.employeeId,
        name: employee.name,
      },
      roles: permissions?.[0]?.roles ?? [],
      permissions: permissions?.[0]?.permissions ?? [],
    };
  }
}
