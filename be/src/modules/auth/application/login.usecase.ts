import type { LoginInput } from 'shared/schemas/auth';
import type { UserRoleInfo } from 'shared/types/auth';
import { inject, injectable } from 'tsyringe';
import type { LoginResult } from '~/modules/auth/application/dto';
import type { AuthClient } from '~/modules/auth/domain/auth-client';
import type { PermissionClient } from '~/modules/auth/domain/permission-client';
import type { RoleRepository } from '~/modules/auth/domain/role.repository';
import type { TokenService } from '~/modules/auth/domain/token-service';
import type { Logger } from '~/shared/application/logger';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

@injectable()
export class LoginUseCase {
  constructor(
    @inject(TOKENS.AuthClient) private readonly authClient: AuthClient,
    @inject(TOKENS.PermissionClient) private readonly permissionClient: PermissionClient,
    @inject(TOKENS.RoleRepository) private readonly roleRepository: RoleRepository,
    @inject(TOKENS.TokenService) private readonly tokens: TokenService,
    @inject(TOKENS.Logger) private readonly logger: Logger,
  ) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    const account = await this.authClient.login(input);

    // Lấy các role (roleId + sectionId) của user từ database.
    const userRoles = await this.roleRepository.findActiveRolesByUsername(account.username);

    // Gom các roleId duy nhất để tránh gọi API permission trùng.
    const uniqueRoleIds = [...new Set(userRoles.map((r) => r.roleId))];

    // Lấy role name + permissions cho từng roleId từ API ngoài.
    const rolePermissionEntries = await Promise.all(
      uniqueRoleIds.map(async (roleId) => {
        try {
          const result = await this.permissionClient.getRolePermissions(roleId, account.token);
          return [roleId, result] as const;
        } catch (error) {
          // Một role lỗi không được chặn toàn bộ login; bỏ qua role đó.
          this.logger.warn({ roleId, error }, 'Failed to fetch permissions for role');
          return null;
        }
      }),
    );

    const rolePermissionByRoleId = new Map(rolePermissionEntries.filter((entry) => entry !== null));

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

    const accessToken = this.tokens.signAccessToken({ username: account.username });
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
