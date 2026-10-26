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
};
