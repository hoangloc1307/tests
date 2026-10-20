import { injectable } from 'tsyringe';
import type {
  FlowableClient,
  HistoricProcessInstance,
  HistoricProcessQuery,
  HistoricTask,
  HistoricTaskQuery,
  PaginatedResponse,
  ProcessInstance,
  ProcessVariable,
  StartProcessInput,
  Task,
  TaskQuery,
} from '~/shared/application/flowable/flowable-client';
import { AppError } from '~/shared/domain/app-error';
import { env } from '~/shared/infrastructure/env';
import { HttpClient } from '~/shared/infrastructure/http-client';

@injectable()
export class HttpFlowableClient implements FlowableClient {
  private readonly http: HttpClient;

  constructor() {
    this.http = new HttpClient({
      baseUrl: `${env.FLOWABLE_ENDPOINT}/flowable-rest/service`,
      auth: {
        username: env.FLOWABLE_USER,
        password: env.FLOWABLE_PASSWORD,
      },
    });
  }

  async startProcessInstance(input: StartProcessInput): Promise<ProcessInstance> {
    const { data } = await this.http.post<ProcessInstance>('/runtime/process-instances', {
      processDefinitionId: input.processDefinitionId,
      name: input.name,
      businessKey: input.name,
      variables: input.variables,
    });
    return data;
  }

  async listTasks(processInstanceId: string): Promise<PaginatedResponse<Task>> {
    const { data } = await this.http.get<PaginatedResponse<Task>>('/runtime/tasks', {
      processInstanceId,
      includeTaskLocalVariables: true,
      includeProcessVariables: true,
    });
    return data;
  }

  async getTask(taskId: string): Promise<Task> {
    const { data } = await this.http.get<Task>(`/runtime/tasks/${taskId}`);
    return data;
  }

  async completeTask(taskId: string, variables?: ProcessVariable[]): Promise<void> {
    if (!taskId) {
      throw AppError.badRequest('workflow:emptyTaskId');
    }
    await this.http.post(`/runtime/tasks/${taskId}`, {
      action: 'complete',
      variables,
    });
  }

  async queryTasks(query: TaskQuery): Promise<PaginatedResponse<Task>> {
    const { data } = await this.http.post<PaginatedResponse<Task>>('/query/tasks', {
      processDefinitionKeyLike: 'DOCUMENT_%',
      processInstanceId: query.processInstanceId,
      candidateGroupIn: query.candidateGroups,
      includeTaskLocalVariables: true,
      sort: 'createTime',
      order: 'desc',
    });
    return data;
  }

  async getTaskVariables(taskId: string): Promise<ProcessVariable[]> {
    const { data } = await this.http.get<ProcessVariable[]>(`/runtime/tasks/${taskId}/variables`, {
      scope: 'local',
    });
    return data;
  }

  async getHistoricTasks(query: HistoricTaskQuery): Promise<PaginatedResponse<HistoricTask>> {
    const { data } = await this.http.get<PaginatedResponse<HistoricTask>>(
      '/history/historic-task-instances',
      {
        processInstanceId: query.processInstanceId,
        taskId: query.taskId,
        includeTaskLocalVariables: true,
        includeProcessVariables: query.includeProcessVariables ?? false,
      },
    );
    return data;
  }

  async getHistoricProcessInstances(
    query: HistoricProcessQuery,
  ): Promise<PaginatedResponse<HistoricProcessInstance>> {
    const { data } = await this.http.get<PaginatedResponse<HistoricProcessInstance>>(
      '/history/historic-process-instances',
      {
        processInstanceId: query.processInstanceId,
        includeProcessVariables: true,
        finished: query.finished,
      },
    );
    return data;
  }

  async deleteProcessInstance(processInstanceId: string, deleteReason: string): Promise<void> {
    await this.http.delete(`/runtime/process-instances/${processInstanceId}`, { deleteReason });
  }

  async deleteHistoricProcessInstance(processInstanceId: string): Promise<void> {
    await this.http.delete(`/history/historic-process-instances/${processInstanceId}`);
  }
}
