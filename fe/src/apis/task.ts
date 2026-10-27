import { ENDPOINTS } from 'shared/constants/endpoints';
import type { ApiResponse } from 'shared/types/api';
import type { TaskDetail, TaskListItem } from 'shared/types/task';
import api from '~/lib/axios';
import { buildUrl } from '~/lib/utils';

const getTasks = async (): Promise<ApiResponse<TaskListItem[]>> =>
  await api.get<ApiResponse<TaskListItem[]>>(buildUrl(ENDPOINTS.TASK.PREFIX, ENDPOINTS.TASK.LIST));

const getTaskDetail = async (
  documentId: string,
  taskId: string,
): Promise<ApiResponse<TaskDetail>> =>
  await api.get<ApiResponse<TaskDetail>>(
    buildUrl(ENDPOINTS.TASK.PREFIX, ENDPOINTS.TASK.DETAIL, { documentId, taskId }),
  );

export const taskApi = { getTasks, getTaskDetail };
