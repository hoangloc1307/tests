import { IconDeviceFloppy } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { DOCUMENT_TYPE } from 'shared/schemas/issue';
import type { AbnormalArea, IssueCategory, ItemCategory } from 'shared/schemas/issue/a5';
import { useCreateA5Issue } from '~/hooks/mutations/use-issue';
import A5IssueForm from '~/views/pages/abnormal-a5/a5-issue-form';
import { useA5IssueForm, type A5FormValues } from '~/views/pages/abnormal-a5/use-a5-issue-form';

export default function AbnormalA5Page() {
  const { t } = useTranslation();
  const createIssue = useCreateA5Issue();

  const defaultValues: A5FormValues = {
    documentType: DOCUMENT_TYPE.A5,
    issueSection: '',
    issueCategory: '' as IssueCategory | '',
    itemCategory: '' as ItemCategory | '',
    itemCode: '',
    lotNo: '',
    lineNo: '',
    machineNo: '',
    glue: '',
    rubber: '',
    batchNo: '',
    detectedQuantity: null as number | null,
    detectedAt: format(new Date(), 'yyyyMMdd'),
    jobOrderNo: '',
    detectionStage: '',
    detectionContent: '',
    abnormalArea: '' as AbnormalArea | '',
    normalDescription: '',
    abnormalDescription: '',
    detectedBy: '',
    checkedBy: '',
    abnormalLevel: '',
    judgment: null,
    isA4Required: null,
    firstDetection: null,
    recurrenceCount: null,
    isHandlingRequired: null,
    handlingScope: '',
    handlingInstruction: '',
    ngQtyAfterHandling: null,
    okQtyAfterHandling: null,
    issueDate: format(new Date(), 'yyyyMMdd'),
  };

  const form = useA5IssueForm({
    defaultValues,
    onSubmit: async (value) => {
      await createIssue.mutateAsync(value);
    },
  });

  return (
    <A5IssueForm
      form={form}
      title={t('navigation:issue_create')}
      actions={
        <form.AppForm>
          <form.SubmitButton>
            <IconDeviceFloppy data-icon='inline-start' /> {t('common:save')}
          </form.SubmitButton>
        </form.AppForm>
      }
    />
  );
}
