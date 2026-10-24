import { inject, injectable } from 'tsyringe';
import type { PermissionClient, RolePermissions } from '~/modules/auth/domain/permission-client';
import type { ActiveUserRole, RoleRepository } from '~/modules/auth/domain/role.repository';
import type { Logger } from '~/shared/application/logger';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

export interface ResolvedUserRolePermissions {
  userRoles: ActiveUserRole[];
  rolePermissionByRoleId: Map<string, RolePermissions>;
}

@injectable()
export class ResolveUserRolePermissionsService {
  constructor(
    @inject(TOKENS.RoleRepository) private readonly roleRepository: RoleRepository,
    @inject(TOKENS.PermissionClient) private readonly permissionClient: PermissionClient,
    @inject(TOKENS.Logger) private readonly logger: Logger,
  ) {}

  async execute(username: string, accessToken: string): Promise<ResolvedUserRolePermissions> {
    // 1. Lấy các role (roleId + sectionId) của user từ database.
    const userRoles = await this.roleRepository.findActiveRolesByUsername(username);

    // 2. Gom các roleId duy nhất để tránh gọi API permission trùng roleId.
    const uniqueRoleIds = [...new Set(userRoles.map((role) => role.roleId))];

    // 3. Lấy role name + permissions cho từng roleId từ API ngoài.
    const rolePermissionEntries = await Promise.all(
      uniqueRoleIds.map(async (roleId) => {
        try {
          const result = await this.permissionClient.getRolePermissions(roleId, accessToken);
          return [roleId, result] as const;
        } catch (error) {
          this.logger.warn({ roleId, error }, 'Failed to fetch permissions for role');
          return null;
        }
      }),
    );

    // 4. Lọc bỏ ra những cái gọi API thất bại.
    const rolePermissionByRoleId = new Map(rolePermissionEntries.filter((entry) => entry !== null));

    return { userRoles, rolePermissionByRoleId };
  }
}
