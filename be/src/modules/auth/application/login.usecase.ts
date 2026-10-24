import type { LoginInput } from 'shared/schemas/auth';
import type { UserRoleInfo } from 'shared/types/auth';
import { inject, injectable } from 'tsyringe';
import type { LoginResult } from '~/modules/auth/application/dto';
import { ResolveUserRolePermissionsService } from '~/modules/auth/application/resolve-user-role-permissions.service';
import type { AuthClient } from '~/modules/auth/domain/auth-client';
import type { TokenService } from '~/modules/auth/domain/token-service';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

@injectable()
export class LoginUseCase {
  constructor(
    @inject(TOKENS.AuthClient) private readonly authClient: AuthClient,
    @inject(TOKENS.TokenService) private readonly tokens: TokenService,
    private readonly resolveUserRolePermissions: ResolveUserRolePermissionsService,
  ) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    const account = await this.authClient.login(input);

    // Lấy role_section + permissions của user (dùng service chung).
    const { userRoles, rolePermissionByRoleId } = await this.resolveUserRolePermissions.execute(
      account.username,
      account.token,
    );

    // roles: [{ role: roleName, section: sectionId }], bỏ các role không lấy được thông tin.
    const roles: UserRoleInfo[] = userRoles.flatMap((userRole) => {
      const info = rolePermissionByRoleId.get(userRole.roleId);
      if (!info) return [];
      return [{ role: info.roleName, section: userRole.sectionId }];
    });

    // permissions: union tất cả permission của các role (loại trùng).
    const permissions = [
      ...new Set([...rolePermissionByRoleId.values()].flatMap((info) => info.permissions)),
    ];

    const accessToken = this.tokens.signAccessToken({
      username: account.username,
      vnnToken: account.token,
    });
    const refreshToken = this.tokens.signRefreshToken({ username: account.username });

    return {
      accessToken,
      refreshToken,
      user: {
        username: account.username,
        name: account.displayName,
      },
      roles,
      permissions,
      vnnToken: account.token,
    };
  }
}
