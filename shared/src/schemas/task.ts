import type { DocumentType } from 'shared/schemas/issue';

/**
 * Một dòng công việc (task) đang chờ user xử lý trong danh sách công việc.
 * Dữ liệu được tổng hợp từ Flowable (task) + DocumentMaster + StepMaster.
 */
export interface TaskListItem {
  /** Id task trên Flowable. */
  taskId: string;
  /** Mã phiếu. */
  documentNo: string;
  /** Loại phiếu (A5, ...). */
  documentType: DocumentType;
  /** Bộ phận phát hành. */
  issuingSection: string;
  /** Bộ phận tiếp nhận. */
  receivingSection: string | null;
  /** Ngày phát hành (YYYYMMDD). */
  issuingDate: string | null;
  /** Mô tả bước hiện tại của phiếu. */
  currentStep: string | null;
  /** Mã người tạo phiếu. */
  createdBy: string;
  /** Thời điểm tạo phiếu (YYYYMMDDHHmmss). */
  createdDate: string | null;
  /** Lí do trả về/từ chối (nếu có). */
  rejectReason: string | null;
}
