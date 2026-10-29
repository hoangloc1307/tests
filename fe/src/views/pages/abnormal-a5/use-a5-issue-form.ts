import type { DOCUMENT_TYPE } from 'shared/schemas/issue';
import { createA5IssueSchema, type CreateA5IssueRequest } from 'shared/schemas/issue/a5';
import { useAppForm } from '~/hooks/use-app-form';

type WithEmpty<T> = T extends boolean | number ? T | null : T extends string ? T | '' : T;

/** Thêm type của giá trị default khi chưa nhập gì */
export type A5FormValues = {
  [K in keyof Omit<CreateA5IssueRequest, 'documentType'>]: WithEmpty<CreateA5IssueRequest[K]>;
} & {
  documentType: typeof DOCUMENT_TYPE.A5;
};

interface UseA5IssueFormOptions {
  defaultValues: A5FormValues;
  readOnly?: boolean;
  onSubmit?: (value: CreateA5IssueRequest) => Promise<void> | void;
}

export function useA5IssueForm({ defaultValues, readOnly, onSubmit }: UseA5IssueFormOptions) {
  return useAppForm({
    defaultValues,
    validators: {
      onSubmit: createA5IssueSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      if (readOnly) return;
      await onSubmit?.(value as CreateA5IssueRequest);
      formApi.reset();
    },
  });
}

export type A5IssueForm = ReturnType<typeof useA5IssueForm>;
