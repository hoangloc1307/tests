import CONFIG from '~/configs/app';
import { masterApi } from '~/lib/axios';

export interface Process {
  ProcessId: string;
  OperationNameVI: string;
  OperationNameEn: string;
  OperationNameJp: string;
  Factory: string;
  LocationPartCode: string;
  IsActive: boolean;
  PgmId: string;
  CreatedBy: string;
  CreatedAt: string;
  UpdatedBy: string;
  UpdatedAt: string;
}

export interface ErrorConfig {
  ErrorCode: string;
  ProcessId: string;
  IsActive: boolean;
  NameVI: string;
  NameJP: string;
  NameEN: string;
}

interface Role {
  RoleId: string;
  TenantId: string;
  RoleName: string;
  Description: string | null;
  IsActive: boolean;
  IsSystemRole: boolean;
  CreatedDate: string;
  CreatedBy: string;
  UpdatedDate: string;
  UpdatedBy: string;
}

interface MasterApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
}

const getProcesses = async (): Promise<Process[]> => {
  const response = await masterApi.get<MasterApiResponse<Process[]>>('/processmaster/all');
  return response.data;
};

const getErrorsByProcess = async (processId: string): Promise<ErrorConfig[]> => {
  const response = await masterApi.get<MasterApiResponse<ErrorConfig[]>>(
    `/errorconfig/process/${processId}`,
  );
  return response.data;
};

const getRoles = async (): Promise<Role[]> => {
  const response = await masterApi.get<MasterApiResponse<{ roles: Role[] }>>(
    `/rbac/tenants/${CONFIG.A5_TENANT_ID}/roles`,
  );

  return response.data.roles;
};

export const masterApis = {
  getProcesses,
  getErrorsByProcess,
  getRoles,
};
