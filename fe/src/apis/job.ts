import { ENDPOINTS } from 'shared/constants/endpoints';
import type { ApiResponse } from 'shared/types/api';
import type { HoldingJobListItem, JobInfo } from 'shared/types/job';
import api from '~/lib/axios';
import { buildUrl } from '~/lib/utils';

const getJobInfo = async (jobOrderNo: string): Promise<ApiResponse<JobInfo>> =>
  await api.get<ApiResponse<JobInfo>>(
    buildUrl(ENDPOINTS.JOB.PREFIX, ENDPOINTS.JOB.DETAIL, {
      jobOrderNo: encodeURIComponent(jobOrderNo),
    }),
  );

const getHoldingJobs = async (): Promise<ApiResponse<HoldingJobListItem[]>> =>
  await api.get<ApiResponse<HoldingJobListItem[]>>(
    buildUrl(ENDPOINTS.JOB.PREFIX, ENDPOINTS.JOB.HOLDING_LIST),
  );

export const jobApi = { getJobInfo, getHoldingJobs };
