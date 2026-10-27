import { useTranslation } from 'react-i18next';
import { DOCUMENT_TYPE } from 'shared/schemas/issue';
import type { A5TaskDetailResponse } from 'shared/types/task';
import A5IssueForm, { type A5FormValues } from '~/views/pages/abnormal-a5/a5-issue-form';

const toFormValues = (task: A5TaskDetailResponse): A5FormValues => ({
  documentType: DOCUMENT_TYPE.A5,
  documentNo: task.documentNo,
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
  jobOrderNo: task.detail.jobOrderNo ?? '',
  detectionStage: task.detail.detectionStage,
  detectionContent: task.detail.detectionContent,
  abnormalArea: task.detail.abnormalArea,
  normalDescription: task.detail.normalDescription,
  abnormalDescription: task.detail.abnormalDescription,
  detectedBy: task.detail.detectedBy,
});

export default function A5TaskDetailView({ task }: { task: A5TaskDetailResponse }) {
  const { t } = useTranslation();

  return (
    <A5IssueForm
      title={`${t('task:detail.title')} - ${task.documentNo}`}
      defaultValues={toFormValues(task)}
      readOnly
    />
  );
}
