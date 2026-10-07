import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiResponse } from 'shared/types/api';
import { toast } from '~/components/ui/toast';

export function useAppMutation<TData, TVariables>(
  options: UseMutationOptions<TData, AxiosError<ApiResponse<unknown>>, TVariables>,
) {
  return useMutation({
    ...options,
    onError: (error, variables, onMutateResult, context) => {
      toast.add({
        type: 'error',
        title: error.response?.data?.message ?? error.message ?? 'Something went wrong',
        description: 'CODE: ' + (error.response?.data?.errorCode ?? 'UNKNOWN'),
      });

      options.onError?.(error, variables, onMutateResult, context);
    },
  });
}
