import type { AbnormalLevel } from 'shared/schemas/issue/a5';

export interface HoldJobData {
  jobOrderNo: string;
  documentNo: string;
  abnormalLevel: AbnormalLevel;
}

export interface JobHoldRepository {
  hold(data: HoldJobData): Promise<void>;
}
