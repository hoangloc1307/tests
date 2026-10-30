export interface JobInfo {
  jobOrderNo: string;
  itemCode: string | null;
  lineNo: string | null;
  machineNo: string | null;
  lotNo: string | null;
}

export interface HoldingJobListItem {
  jobOrderNo: string;
  documentNo: string;
  abnormalLevel: number;
  holdAt: string;
}
