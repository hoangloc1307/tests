import { FlowableVariableScopeValue } from '~/shared/application/flowable/flowable-constants';

// ==================== Common Types ====================

export interface ProcessVariable {
  name: string;
  value: unknown;
  type?: string;
  scope?: FlowableVariableScopeValue;
}

// ==================== Process Instance Types ====================

export interface StartProcessInput {
  processDefinitionId: string;
  name: string;
  variables?: ProcessVariable[];
}

export interface ProcessInstance {
  id: string;
  url: string;
  name: string;
  businessKey: string;
  suspended: boolean;
  ended: boolean;
  processDefinitionId: string;
  processDefinitionUrl: string;
  processDefinitionName: string;
  processDefinitionDescription: string | null;
  activityId: string | null;
  startUserId: string | null;
  startTime: string;
  variables: ProcessVariable[];
  tenantId: string;
  completed: boolean;
}

export interface HistoricProcessInstance extends ProcessInstance {
  endTime: string | null;
  durationInMillis: number | null;
  deleteReason: string | null;
}

// ==================== Task Types ====================

export interface Task {
  id: string;
  url: string;
  owner: string | null;
  assignee: string | null;
  delegationState: string | null;
  name: string;
  description: string | null;
  createTime: string;
  dueDate: string | null;
  priority: number;
  suspended: boolean;
  claimTime: string | null;
  taskDefinitionKey: string;
  scopeDefinitionId: string | null;
  scopeId: string | null;
  subScopeId: string | null;
  scopeType: string | null;
  propagatedStageInstanceId: string | null;
  tenantId: string;
  category: string | null;
  formKey: string | null;
  parentTaskId: string | null;
  parentTaskUrl: string | null;
  executionId: string;
  executionUrl: string;
  processInstanceId: string;
  processInstanceUrl: string;
  processDefinitionId: string;
  processDefinitionUrl: string;
  variables: ProcessVariable[];
}

export interface HistoricTask {
  id: string;
  processDefinitionId: string;
  processDefinitionUrl: string;
  processInstanceId: string;
  processInstanceUrl: string;
  executionId: string;
  name: string;
  description: string | null;
  deleteReason: string | null;
  owner: string | null;
  assignee: string | null;
  startTime: string;
  endTime: string | null;
  durationInMillis: number | null;
  workTimeInMillis: number | null;
  claimTime: string | null;
  taskDefinitionKey: string;
  formKey: string | null;
  priority: number;
  dueDate: string | null;
  parentTaskId: string | null;
  url: string;
  variables: ProcessVariable[];
  tenantId: string;
  category: string | null;
}

// ==================== Query Types ====================

export interface TaskQuery {
  candidateGroups?: string[];
  processInstanceId?: string;
}

export interface HistoricTaskQuery {
  processInstanceId?: string;
  taskId?: string;
  includeProcessVariables?: boolean;
}

export interface HistoricProcessQuery {
  processInstanceId?: string;
  finished?: boolean;
}

// ==================== Response Types ====================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  start: number;
  sort: string;
  order: string;
  size: number;
}

// ==================== Flowable Client Interface ====================

export interface FlowableClient {
  startProcessInstance(input: StartProcessInput): Promise<ProcessInstance>;
  listTasks(processInstanceId: string): Promise<PaginatedResponse<Task>>;
  getTask(taskId: string): Promise<Task>;
  completeTask(taskId: string, variables?: ProcessVariable[]): Promise<void>;
  queryTasks(query: TaskQuery): Promise<PaginatedResponse<Task>>;
  getTaskVariables(taskId: string): Promise<ProcessVariable[]>;
  getHistoricTasks(query: HistoricTaskQuery): Promise<PaginatedResponse<HistoricTask>>;
  getHistoricProcessInstances(
    query: HistoricProcessQuery,
  ): Promise<PaginatedResponse<HistoricProcessInstance>>;
  deleteProcessInstance(processInstanceId: string, deleteReason: string): Promise<void>;
  deleteHistoricProcessInstance(processInstanceId: string): Promise<void>;
}
