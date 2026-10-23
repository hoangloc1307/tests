import { queryOptions } from '@tanstack/react-query';
import { masterApis } from '~/apis/master';

export const masterQueries = {
  processes: () =>
    queryOptions({
      queryKey: ['master', 'processes'],
      queryFn: () => masterApis.getProcesses(),
      staleTime: Infinity,
    }),
  errorsByProcess: (processId: string) =>
    queryOptions({
      queryKey: ['master', 'errors', processId],
      queryFn: () => masterApis.getErrorsByProcess(processId),
      enabled: !!processId,
      staleTime: Infinity,
    }),
  roles: () =>
    queryOptions({
      queryKey: ['master', 'roles'],
      queryFn: () => masterApis.getRoles(),
      staleTime: Infinity,
    }),
};
