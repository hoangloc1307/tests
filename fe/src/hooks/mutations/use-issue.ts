import type { CreateA5IssueRequest } from 'shared/schemas/issue/a5';
import { issueApi } from '~/apis/issue';
import { toast } from '~/components/ui/toast';
import { useAppMutation } from '~/hooks/use-app-mutation';

export function useCreateA5Issue() {
  return useAppMutation({
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
