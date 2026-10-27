/** Chi tiết phiếu A5 lấy từ DB (giữ nguyên kiểu Date để handler/usecase tự format). */
export interface A5DocumentDetail {
  issueCategory: string;
  itemCategory: string;
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
  abnormalArea: string;
  detectedAt: Date;
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

export interface A5TaskDetailRepository {
  findDetailByDocumentId(documentId: string): Promise<A5DocumentDetail | null>;
}
