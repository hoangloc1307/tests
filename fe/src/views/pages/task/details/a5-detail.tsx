import { IconCheck, IconCornerUpLeft } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { DOCUMENT_TYPE } from 'shared/schemas/issue';
import type { AbnormalLevelValue } from 'shared/schemas/issue/a5';
import type { A5TaskDetailResponse } from 'shared/types/task';
import { Button } from '~/components/ui/button';
import A5IssueForm from '~/views/pages/abnormal-a5/a5-issue-form';
import { useA5IssueForm, type A5FormValues } from '~/views/pages/abnormal-a5/use-a5-issue-form';

const toFormValues = (task: A5TaskDetailResponse): A5FormValues => ({
  documentType: DOCUMENT_TYPE.A5,
  issueSection: task.issuingSection,
  issueDate: task.issuingDate ?? '',
  issueCategory: task.detail.issueCategory,
  itemCategory: task.detail.itemCategory,
  itemCode: task.detail.itemCode,
  lotNo: task.detail.lotNo,
  lineNo: task.detail.lineNo,
  machineNo: task.detail.machineNo,
  glue: task.detail.glue,
  rubber: task.detail.rubber,
  batchNo: task.detail.batchNo,
  detectedQuantity: task.detail.detectedQuantity,
  detectedAt: task.detail.detectedAt,
  jobOrderNo: task.detail.jobOrderNo ?? '',
  detectionStage: task.detail.detectionStage,
  detectionContent: task.detail.detectionContent,
  abnormalArea: task.detail.abnormalArea,
  normalDescription: task.detail.normalDescription,
  abnormalDescription: task.detail.abnormalDescription,
  detectedBy: task.detail.detectedBy,
  checkedBy: task.detail.checkedBy,
  abnormalLevel: task.detail.abnormalLevel
    ? (String(task.detail.abnormalLevel) as AbnormalLevelValue)
    : '',
  judgment: task.detail.judgment,
  isA4Required: task.detail.isA4Required,
  firstDetection: task.detail.firstDetection,
  recurrenceCount: task.detail.recurrenceCount,
  isHandlingRequired: task.detail.isHandlingRequired,
  handlingScope: task.detail.handlingScope ?? '',
  ngQtyAfterHandling: task.detail.ngQtyAfterHandling,
  okQtyAfterHandling: task.detail.okQtyAfterHandling,
  handlingInstruction: task.detail.handlingInstruction ?? '',
});

export default function A5TaskDetailView({ task }: { task: A5TaskDetailResponse }) {
  const { t } = useTranslation();

  const form = useA5IssueForm({ defaultValues: toFormValues(task), readOnly: true });

  return (
    <A5IssueForm
      form={form}
      title={`${t('task:detail.title')}: ${task.documentNo}`}
      readOnly
      actions={
        <div className='flex gap-2'>
          <Button type='button' variant='outline'>
            <IconCornerUpLeft data-icon='inline-start' /> {t('task:detail.return')}
          </Button>
          <Button type='button'>
            <IconCheck data-icon='inline-start' /> {t('task:detail.approve')}
          </Button>
        </div>
      }
    />
  );
}
