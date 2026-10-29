import { ENDPOINTS } from 'shared/constants/endpoints';
import type { CreateA5IssueRequest } from 'shared/schemas/issue/a5';
import type { ApiResponse } from 'shared/types/api';
import api from '~/lib/axios';
import { buildUrl } from '~/lib/utils';

const createA5Issue = async (
  payload: CreateA5IssueRequest,
): Promise<ApiResponse<{ documentNo: string }>> =>
  await api.post<ApiResponse<{ documentNo: string }>>(
    buildUrl(ENDPOINTS.ISSUE.PREFIX, ENDPOINTS.ISSUE.CREATE_A5),
    payload,
  );

export const issueApi = {
  createA5Issue,
};
