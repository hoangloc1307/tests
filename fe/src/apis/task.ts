import { ENDPOINTS } from 'shared/constants/endpoints';
import type { ApiResponse } from 'shared/types/api';
import type { TaskListItem } from 'shared/types/task';
import api from '~/lib/axios';
import { buildUrl } from '~/lib/utils';

const getTasks = async (): Promise<ApiResponse<TaskListItem[]>> =>
  await api.get<ApiResponse<TaskListItem[]>>(buildUrl(ENDPOINTS.TASK.PREFIX, ENDPOINTS.TASK.LIST));

export const taskApi = { getTasks };
