import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { taskQueries } from '~/hooks/queries/task.queries';
import { renderTaskDetail } from '~/views/pages/task/details/registry';

export default function TaskDetailPage() {
  const { t } = useTranslation();
  const { documentId = '', taskId = '' } = useParams();

  const { data: task, isPending, isError } = useQuery(taskQueries.detail(documentId, taskId));

  if (isPending) {
    return (
      <p className='text-primary animate-pulse py-10 text-center text-sm font-medium'>
        {t('common:processing')}...
      </p>
    );
  }

  if (isError || !task) {
    return <p className='text-muted-foreground py-10 text-center'>{t('task:detail.not_found')}</p>;
  }

  const view = renderTaskDetail(task);

  if (!view) {
    return (
      <p className='text-muted-foreground py-10 text-center'>
        {t('task:detail.unsupported_type', { documentType: task.documentType })}
      </p>
    );
  }

  return view;
}
