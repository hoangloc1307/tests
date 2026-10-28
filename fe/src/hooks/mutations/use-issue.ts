import type { CreateA5IssueInput } from 'shared/schemas/issue';
import { issueApi } from '~/apis/issue';
import { toast } from '~/components/ui/toast';
import { useAppMutation } from '~/hooks/use-app-mutation';

export function useCreateA5Issue() {
  return useAppMutation({
    mutationFn: (payload: CreateA5IssueInput) => issueApi.createA5Issue(payload),
    onSuccess: (data) => {
      toast.add({
        type: 'success',
        title: data.message,
        description: data.data?.documentNo,
      });
    },
  });
}
