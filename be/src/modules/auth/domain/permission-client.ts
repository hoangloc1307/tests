export interface UserPermission {
  tenantId: string;
  tenantCode: string;
  tenantName: string;
  roles: string[];
  permissions: string[];
}

export interface RolePermissions {
  roleName: string;
  permissions: string[];
}

export interface PermissionClient {
  getUserPermissions(accountId: string): Promise<UserPermission[]>;
  getRolePermissions(roleId: string, accessToken: string): Promise<RolePermissions>;
}
