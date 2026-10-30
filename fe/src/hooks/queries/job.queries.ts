import { queryOptions } from '@tanstack/react-query';
import { jobApi } from '~/apis/job';

export const jobQueries = {
  detail: (jobOrderNo: string) =>
    queryOptions({
      queryKey: ['job', 'detail', jobOrderNo],
      queryFn: async () => {
        const res = await jobApi.getJobInfo(jobOrderNo);
        return res.data ?? null;
      },
      staleTime: 5 * 60 * 1000,
    }),
};
