import type { CreateIssueInput } from 'shared/schemas/issue';
import { issueApi } from '~/apis/issue';
import { toast } from '~/components/ui/toast';
import { useAppMutation } from '~/hooks/use-app-mutation';

export function useCreateIssue() {
  return useAppMutation({
    mutationFn: (payload: CreateIssueInput) => issueApi.createIssue(payload),
    onSuccess: (data) => {
      toast.add({
        type: 'success',
        title: data.message,
        description: data.data?.documentNo,
      });
    },
  });
}
