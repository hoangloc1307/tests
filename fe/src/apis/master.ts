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

export const masterApis = {
  getProcesses,
  getErrorsByProcess,
};
