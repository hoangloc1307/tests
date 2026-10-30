import { useMutation } from '@tanstack/react-query';
import type { CreateA5IssueRequest } from 'shared/schemas/issue/a5';
import { issueApi } from '~/apis/issue';
import { toast } from '~/components/ui/toast';

export function useCreateA5Issue() {
  return useMutation({
    mutationFn: (payload: CreateA5IssueRequest) => issueApi.createA5Issue(payload),
    onSuccess: (data) => {
      toast.add({
        type: 'success',
        title: data.message,
        description: data.data?.documentNo,
      });
    },
  });
}
