import type { AbnormalArea, IssueCategory, ItemCategory } from 'shared/schemas/issue';

export interface Issue {
  documentId: string;
  documentNo: string;
  issueSection: string;
  issueCategory: IssueCategory;
  itemCategory: ItemCategory;
  lineNo: string;
  jobOrderNo: string | null;
  machineNo: string;
  lotNo: string;
  batchNo: string;
  itemCode: string;
  rubber: string;
  glue: string;
  detectionStage: string;
  detectionContent: string;
  otherError: string | null;
  detectedBy: string;
  detectedQuantity: number;
  abnormalArea: AbnormalArea;
  issueDate: Date;
  normalDescription: string;
  abnormalDescription: string;
  checkedBy: string | null;
  abnormalLevel: number | null;
  firstDetection: boolean | null;
  recurrenceCount: number | null;
  isA4Required: boolean | null;
  ngQtyAfterHandling: number | null;
  okQtyAfterHandling: number | null;
  amsDocumentNo: string | null;
}
