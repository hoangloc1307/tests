import type {
  AbnormalArea,
  DocumentStatus,
  DocumentType,
  IssueCategory,
  ItemCategory,
} from 'shared/schemas/issue';

export interface DocumentMaster {
  documentId: string;
  documentNo: string;
  documentType: DocumentType;
  processMasterId: string;
  processInstanceId: string;
  issueSection: string;
  issueDate: Date;
  receiveSection: string | null;
  finishDate: Date | null;
  cancelReason: string | null;
  status: DocumentStatus;
}

/**
 * Phần dữ liệu riêng của phiếu A5 — ánh xạ bảng A5Document
 * (không bao gồm các field đã thuộc DocumentMaster).
 */
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
  abnormalArea: AbnormalArea;
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

export type A5Issue = DocumentMaster & A5Detail;

export interface ProcessMaster {
  id: string;
  processDefinitionId: string;
}
