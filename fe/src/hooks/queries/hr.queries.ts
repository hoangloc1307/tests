import { queryOptions } from '@tanstack/react-query';
import { hrApis } from '~/apis/hr';

export const hrQueries = {
  sections: () =>
    queryOptions({
      queryKey: ['hr', 'sections'],
      queryFn: () => hrApis.getSections(),
      staleTime: Infinity,
    }),
};
