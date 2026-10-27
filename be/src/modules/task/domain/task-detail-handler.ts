import type { DocumentType } from 'shared/schemas/issue';
import type { TaskDetail } from 'shared/types/task';

/** Phần chi tiết riêng theo từng loại phiếu (documentType + detail), lấy từ union TaskDetail. */
export type TaskDetailPart = Pick<TaskDetail, 'documentType' | 'detail'>;

/**
 * Handler cung cấp phần chi tiết riêng của một loại phiếu cho API chi tiết công việc.
 * Mỗi loại phiếu một handler, tự query bảng chi tiết tương ứng.
 */
export interface TaskDetailHandler {
  readonly documentType: DocumentType;

  /** Trả về phần chi tiết riêng theo documentId; null nếu không tìm thấy bản ghi chi tiết. */
  getDetail(documentId: string): Promise<TaskDetailPart | null>;
}
