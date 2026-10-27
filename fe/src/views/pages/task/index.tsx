import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ENDPOINTS } from 'shared/constants/endpoints';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { useSections } from '~/hooks/use-sections';
import { taskQueries } from '~/hooks/queries/task.queries';
import { buildUrl, formatCompactDate, formatCompactDateTime } from '~/lib/utils';

const EMPTY = '-';

export default function TaskPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: tasks = [] } = useQuery(taskQueries.list());
  const { getSectionLabel } = useSections();

  return (
    <div className='space-y-4'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-foreground text-2xl font-bold capitalize'>{t('navigation:task')}</h1>
      </div>

      <div className='overflow-hidden rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('task:table.document_no')}</TableHead>
              <TableHead>{t('task:table.document_type')}</TableHead>
              <TableHead>{t('task:table.issuing_section')}</TableHead>
              <TableHead>{t('task:table.receiving_section')}</TableHead>
              <TableHead>{t('task:table.issuing_date')}</TableHead>
              <TableHead>{t('task:table.current_step')}</TableHead>
              <TableHead>{t('task:table.created_by')}</TableHead>
              <TableHead>{t('task:table.created_date')}</TableHead>
              <TableHead>{t('task:table.reject_reason')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className='text-muted-foreground py-6 text-center'>
                  {t('task:table.empty')}
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((item) => (
                <TableRow
                  key={item.taskId}
                  className='hover:bg-muted/50 cursor-pointer'
                  onClick={() =>
                    navigate(
                      buildUrl(ENDPOINTS.TASK.PREFIX, ENDPOINTS.TASK.DETAIL, {
                        documentId: item.documentId,
                        taskId: item.taskId,
                      }),
                    )
                  }
                >
                  <TableCell className='font-medium'>{item.documentNo || EMPTY}</TableCell>
                  <TableCell>{item.documentType}</TableCell>
                  <TableCell>{getSectionLabel(item.issuingSection) ?? EMPTY}</TableCell>
                  <TableCell>{getSectionLabel(item.receivingSection) ?? EMPTY}</TableCell>
                  <TableCell>{formatCompactDate(item.issuingDate) ?? EMPTY}</TableCell>
                  <TableCell>{item.currentStep ?? EMPTY}</TableCell>
                  <TableCell>{item.createdBy || EMPTY}</TableCell>
                  <TableCell>{formatCompactDateTime(item.createdDate) ?? EMPTY}</TableCell>
                  <TableCell>{item.rejectReason ?? EMPTY}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
