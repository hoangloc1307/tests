import { injectable } from 'tsyringe';
import type { PermissionClient, UserPermission } from '~/modules/auth/domain/permission-client';
import { AppError } from '~/shared/domain/app-error';
import { env } from '~/shared/infrastructure/env';

interface ExternalApiResponse {
  success: boolean;
  data: Array<{
    tenantId: string;
    tenantCode: string;
    tenantName: string;
    roles: string[];
    permissions: string[];
  }>;
}

@injectable()
export class HttpPermissionClient implements PermissionClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = env.VNN_MASTER_ENDPOINT;
  }

  async getUserPermissions(accountId: string): Promise<UserPermission[]> {
    const response = await fetch(`${this.baseUrl}/api/v1/user-tenant/${accountId}/tenants`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw AppError.server('auth:fetchPermissionsFailed');
    }

    const data = (await response.json()) as ExternalApiResponse;

    if (!data.success) {
      throw AppError.server('auth:fetchPermissionsFailed');
    }

    return data.data.map((item) => ({
      tenantId: item.tenantId,
      tenantCode: item.tenantCode,
      tenantName: item.tenantName,
      roles: item.roles,
      permissions: item.permissions,
    }));
  }
}
