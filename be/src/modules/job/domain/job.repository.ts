import type { JobInfo } from 'shared/types/job';

export interface HoldingJob {
  jobOrderNo: string;
  documentNo: string;
  abnormalLevel: number;
  holdAt: Date;
}

export interface JobRepository {
  findByJobOrderNo(jobOrderNo: string): Promise<JobInfo | null>;
  findHoldingJobs(): Promise<HoldingJob[]>;
}
