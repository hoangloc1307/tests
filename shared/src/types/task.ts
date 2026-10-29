import type { DocumentStatus, DocumentType } from 'shared/schemas/issue';
import { DOCUMENT_TYPE } from 'shared/schemas/issue';
import type { AbnormalArea, IssueCategory, ItemCategory } from 'shared/schemas/issue/a5';

export interface TaskListItem {
  taskId: string;
  documentId: string;
  documentNo: string;
  documentType: DocumentType;
  issuingSection: string;
  receivingSection: string | null;
  issuingDate: string;
  currentStep: string;
  createdBy: string;
  createdDate: string;
  rejectReason: string | null;
}

export interface A5Detail {
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
  detectedAt: string;
  abnormalArea: AbnormalArea;
  normalDescription: string;
  abnormalDescription: string;
  checkedBy: string;
  abnormalLevel: number;
  judgment: boolean;
  firstDetection: boolean;
  recurrenceCount: number | null;
  isA4Required: boolean;
  isHandlingRequired: boolean;
  handlingScope: string | null;
  handlingInstruction: string | null;
  ngQtyAfterHandling: number | null;
  okQtyAfterHandling: number | null;
  amsDocumentNo: string | null;
  otherAbnormalContent: string | null;
  batchQty: number | null;
  lotQty: number | null;
  needCheckingQty: number | null;
  qtyChecked: number | null;
  controlOfBeginning: boolean | null;
  attachSample: boolean | null;
  ngEmp: string | null;
}

export interface TaskDetailBase {
  taskId: string;
  documentId: string;
  documentNo: string;
  status: DocumentStatus;
  issuingSection: string;
  receivingSection: string | null;
  issuingDate: string;
  createdBy: string;
  createdDate: string;
  rejectReason: string | null;
}

export interface A5TaskDetailResponse extends TaskDetailBase {
  documentType: typeof DOCUMENT_TYPE.A5;
  detail: A5Detail;
}

/**
 * Chi tiết công việc trả về cho FE — discriminated union theo `documentType`.
 * Thêm loại phiếu mới: khai báo interface `XxxTaskDetailResponse` kế thừa
 * `TaskDetailBase` rồi bổ sung vào union này.
 */
export type TaskDetail = A5TaskDetailResponse;
