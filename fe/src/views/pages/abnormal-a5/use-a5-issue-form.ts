import {
  createA5IssueSchema,
  type AbnormalArea,
  type CreateA5IssueInput,
  type DOCUMENT_TYPE,
  type IssueCategory,
  type ItemCategory,
} from 'shared/schemas/issue';
import { useAppForm } from '~/hooks/use-app-form';

export interface A5FormValues {
  documentType: typeof DOCUMENT_TYPE.A5;
  documentNo: string;
  issueSection: string;
  issueCategory: IssueCategory | '';
  itemCategory: ItemCategory | '';
  itemCode: string;
  lotNo: string;
  lineNo: string;
  machineNo: string;
  glue: string;
  rubber: string;
  batchNo: string;
  detectedQuantity: number | null;
  jobOrderNo: string;
  detectionStage: string;
  detectionContent: string;
  abnormalArea: AbnormalArea | '';
  normalDescription: string;
  abnormalDescription: string;
  detectedBy: string;
  checkedBy: string;
  issueDate: string;
}

interface UseA5IssueFormOptions {
  defaultValues: A5FormValues;
  readOnly?: boolean;
  onSubmit?: (value: CreateA5IssueInput) => Promise<void> | void;
}

export function useA5IssueForm({ defaultValues, readOnly, onSubmit }: UseA5IssueFormOptions) {
  return useAppForm({
    defaultValues,
    validators: {
      onSubmit: createA5IssueSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      if (readOnly) return;
      const payload = createA5IssueSchema.parse(value);
      await onSubmit?.(payload);
      formApi.reset();
    },
  });
}

export type A5IssueForm = ReturnType<typeof useA5IssueForm>;
