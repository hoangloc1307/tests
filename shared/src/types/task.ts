import { DOCUMENT_TYPE } from 'shared/schemas/issue';
import type {
  AbnormalArea,
  DocumentStatus,
  DocumentType,
  IssueCategory,
  ItemCategory,
} from 'shared/schemas/issue';

export interface TaskListItem {
  taskId: string;
  documentId: string;
  documentNo: string;
  documentType: DocumentType;
  issuingSection: string;
  receivingSection: string | null;
  issuingDate: string | null;
  currentStep: string | null;
  createdBy: string;
  createdDate: string | null;
  rejectReason: string | null;
}

/** Chi tiết riêng của phiếu A5 trả về cho FE (ánh xạ bảng A5Document). */
export interface A5TaskDetail {
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
  detectedAt: string | null;
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
  otherAbnormalContent: string | null;
  batchQty: number | null;
  lotQty: number | null;
  needCheckingQty: number | null;
  qtyChecked: number | null;
  controlOfBeginning: boolean | null;
  attachSample: boolean | null;
  ngEmp: string | null;
}

/**
 * Phần thông tin chung (master) của chi tiết công việc — dùng cho mọi loại phiếu.
 */
export interface TaskDetailBase {
  taskId: string;
  documentId: string;
  documentNo: string;
  status: DocumentStatus;
  issuingSection: string;
  receivingSection: string | null;
  issuingDate: string | null;
  createdBy: string;
  createdDate: string | null;
  rejectReason: string | null;
}

/** Chi tiết công việc của phiếu A5 (master chung + dữ liệu riêng A5). */
export interface A5TaskDetailResponse extends TaskDetailBase {
  documentType: typeof DOCUMENT_TYPE.A5;
  detail: A5TaskDetail;
}

/**
 * Chi tiết công việc trả về cho FE — discriminated union theo `documentType`.
 * Thêm loại phiếu mới: khai báo interface `XxxTaskDetailResponse` kế thừa
 * `TaskDetailBase` rồi bổ sung vào union này.
 */
export type TaskDetail = A5TaskDetailResponse;
