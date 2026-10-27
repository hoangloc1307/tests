import type { ReactNode } from 'react';
import { DOCUMENT_TYPE, type DocumentType } from 'shared/schemas/issue';
import type { TaskDetail } from 'shared/types/task';
import A5TaskDetailView from '~/views/pages/task/details/a5-detail';

/**
 * Registry ánh xạ loại phiếu -> component hiển thị chi tiết tương ứng.
 * Thêm loại phiếu mới: tạo view riêng rồi đăng ký một entry ở đây.
 */
const TASK_DETAIL_VIEWS: Partial<Record<DocumentType, (task: TaskDetail) => ReactNode>> = {
  [DOCUMENT_TYPE.A5]: (task) =>
    task.documentType === DOCUMENT_TYPE.A5 ? <A5TaskDetailView task={task} /> : null,
};

/** Render chi tiết công việc theo loại phiếu; null nếu chưa có view cho loại đó. */
export const renderTaskDetail = (task: TaskDetail): ReactNode =>
  TASK_DETAIL_VIEWS[task.documentType]?.(task) ?? null;
