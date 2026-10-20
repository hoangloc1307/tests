import type { FlowableClient, ProcessVariable } from './flowable-client';
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
