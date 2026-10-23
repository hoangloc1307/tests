import { queryOptions } from '@tanstack/react-query';
import { authApi } from '~/apis/auth';

export const authQueries = {
  userRoles: () =>
    queryOptions({
      queryKey: ['auth', 'user-roles'],
      queryFn: async () => {
        const res = await authApi.getUserRoles();
        return res.data ?? [];
      },
    }),
};
