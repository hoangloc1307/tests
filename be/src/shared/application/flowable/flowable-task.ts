import type { FlowableClient, ProcessVariable, Task } from './flowable-client';
import {
  FLOWABLE_APPROVAL,
  FLOWABLE_VARIABLE_NAME,
  FLOWABLE_VARIABLE_SCOPE,
  type FlowableApprovalValue,
} from './flowable-constants';

export interface FlowableApprovalInput {
  taskId: string;
  completedBy: string;
  approval?: FlowableApprovalValue;
  variables?: ProcessVariable[];
}

/**
 * Hoàn thành task: mặc định duyệt (APPROVED) sang bước tiếp theo nếu không chỉ định approval.
 */
export const flowableApproval = async (
  flowableClient: FlowableClient,
  { taskId, completedBy, approval, variables = [] }: FlowableApprovalInput,
): Promise<void> => {
  const vars: ProcessVariable[] = [
    {
      name: FLOWABLE_VARIABLE_NAME.APPROVAL,
      value: approval ?? FLOWABLE_APPROVAL.APPROVED,
      scope: FLOWABLE_VARIABLE_SCOPE.GLOBAL,
    },
    {
      name: FLOWABLE_VARIABLE_NAME.APPROVAL,
      value: approval ?? FLOWABLE_APPROVAL.APPROVED,
      scope: FLOWABLE_VARIABLE_SCOPE.LOCAL,
    },
    {
      name: FLOWABLE_VARIABLE_NAME.COMPLETED_BY,
      value: completedBy,
      scope: FLOWABLE_VARIABLE_SCOPE.LOCAL,
    },
    ...variables,
  ];

  return flowableClient.completeTask(taskId, vars);
};

/**
 * Lấy lí do trả về/từ chối từ biến local của task (nếu có).
 * Trả về null khi không có biến comment hoặc giá trị không phải chuỗi.
 */
export const extractRejectReason = (task: Task): string | null => {
  const comment = (task.variables ?? []).find(
    (v) => v.name === FLOWABLE_VARIABLE_NAME.COMMENT,
  )?.value;
  return typeof comment === 'string' ? comment : null;
};
