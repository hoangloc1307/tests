import type { JobInfo } from 'shared/types/job';

export interface JobRepository {
  findByJobOrderNo(jobOrderNo: string): Promise<JobInfo | null>;
}
