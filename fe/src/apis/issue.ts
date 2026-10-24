import { ENDPOINTS } from 'shared/constants/endpoints';
import type { CreateIssueInput } from 'shared/schemas/issue';
import type { ApiResponse } from 'shared/types/api';
import api from '~/lib/axios';
import { buildUrl } from '~/lib/utils';

const createIssue = async (
  payload: CreateIssueInput,
): Promise<ApiResponse<{ documentNo: string }>> =>
  await api.post<ApiResponse<{ documentNo: string }>>(
    buildUrl(ENDPOINTS.ISSUE.PREFIX, ENDPOINTS.ISSUE.CREATE),
    payload,
  );

export const issueApi = {
  createIssue,
};
