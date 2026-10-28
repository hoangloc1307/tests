import type { A5Detail } from 'shared/types/task';

/**
 * Chi tiết phiếu A5 lấy từ DB. Cùng shape với `A5TaskDetail` (response),
 * nhưng các field enum để kiểu `string` thô vì đọc trực tiếp từ cột VARCHAR —
 * handler sẽ ép kiểu sang enum khi map sang response.
 */
export type A5DocumentDetail = Omit<A5Detail, 'issueCategory' | 'itemCategory' | 'abnormalArea'> & {
  issueCategory: string;
  itemCategory: string;
  abnormalArea: string;
};

export interface A5TaskDetailRepository {
  findDetailByDocumentId(documentId: string): Promise<A5DocumentDetail | null>;
}
