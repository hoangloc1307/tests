import { ENDPOINTS } from 'shared/constants/endpoints';
import type { ApiResponse } from 'shared/types/api';
import type { JobInfo } from 'shared/types/job';
import api from '~/lib/axios';
import { buildUrl } from '~/lib/utils';

const getJobInfo = async (jobOrderNo: string): Promise<ApiResponse<JobInfo>> =>
  await api.get<ApiResponse<JobInfo>>(
    buildUrl(ENDPOINTS.JOB.PREFIX, ENDPOINTS.JOB.DETAIL, {
      jobOrderNo: encodeURIComponent(jobOrderNo),
    }),
  );

export const jobApi = { getJobInfo };
