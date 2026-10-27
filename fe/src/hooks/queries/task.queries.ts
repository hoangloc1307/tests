import { queryOptions } from '@tanstack/react-query';
import { taskApi } from '~/apis/task';

export const taskQueries = {
  list: () =>
    queryOptions({
      queryKey: ['task', 'list'],
      queryFn: async () => {
        const res = await taskApi.getTasks();
        return res.data ?? [];
      },
    }),

  detail: (documentId: string, taskId: string) =>
    queryOptions({
      queryKey: ['task', 'detail', documentId, taskId],
      queryFn: async () => {
        const res = await taskApi.getTaskDetail(documentId, taskId);
        return res.data ?? null;
      },
      enabled: !!documentId && !!taskId,
    }),
};
