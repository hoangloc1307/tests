import { hrApi } from '~/lib/axios';

export interface Section {
  SectionId: string;
  DepartmentId: string;
  PlantId: string;
  Name: string;
  Description: string | null;
  Status: boolean;
}

interface HrApiResponse<T> {
  Data: T;
  StatusCode: string;
  Message: string;
  Success: boolean;
}

const getSections = async (): Promise<Section[]> => {
  const response = await hrApi.get<HrApiResponse<Section[]>>('/api/section');
  return response.Data;
};

export const hrApis = {
  getSections,
};
