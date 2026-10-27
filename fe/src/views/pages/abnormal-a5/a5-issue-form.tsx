import { IconDeviceFloppy } from '@tabler/icons-react';
import { useSelector } from '@tanstack/react-form';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AbnormalAreaEnum,
  createIssueSchema,
  DOCUMENT_TYPE,
  IssueCategoryEnum,
  ItemCategoryEnum,
  type AbnormalArea,
  type CreateIssueInput,
  type IssueCategory,
  type ItemCategory,
} from 'shared/schemas/issue';
import { useAppForm } from '~/hooks/use-app-form';
import { useErrors } from '~/hooks/use-errors';
import { useProcesses } from '~/hooks/use-processes';
import { useSections } from '~/hooks/use-sections';

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
  issueDate: string;
}

interface A5IssueFormProps {
  title: ReactNode;
  defaultValues: A5FormValues;
  readOnly?: boolean;
  onSubmit?: (value: CreateIssueInput) => Promise<void> | void;
}

export default function A5IssueForm({
  title,
  defaultValues,
  readOnly = false,
  onSubmit,
}: A5IssueFormProps) {
  const { t } = useTranslation();
  const { sectionOptions } = useSections();
  const { processOptions } = useProcesses();

  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: createIssueSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      if (readOnly) return;
      const payload = createIssueSchema.parse(value);
      await onSubmit?.(payload);
      formApi.reset();
    },
  });

  const selectedProcess = useSelector(form.store, (state) => state.values.detectionStage);
  const { errorOptions } = useErrors(selectedProcess);

  const categoryOptions = IssueCategoryEnum.options.map((value) => ({
    value,
    label: t(`issue:category_options.${value}`),
  }));

  const detectionTypeOptions = ItemCategoryEnum.options.map((value) => ({
    value,
    label: t(`issue:detection_type_options.${value}`),
  }));

  const anomalyLocationOptions = AbnormalAreaEnum.options.map((value) => ({
    value,
    label: t(`issue:anomaly_location_options.${value}`),
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
          e.preventDefault();
        }
      }}
      className='space-y-4'
    >
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-foreground text-2xl font-bold capitalize'>{title}</h1>
        {!readOnly && (
          <form.AppForm>
            <form.SubmitButton>
              <IconDeviceFloppy data-icon='inline-start' /> {t('common:save')}
            </form.SubmitButton>
          </form.AppForm>
        )}
      </div>

      {/* Thông tin phát hành */}
      <h2 className='border-b font-semibold capitalize'>{t('issue:info_title')}</h2>
      <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
        {/* Bộ phận phát hành */}
        <form.AppField
          name='issueSection'
          children={(field) => (
            <field.ComboboxField
              label={t('issue:section')}
              required
              options={sectionOptions}
              placeholder={t('issue:section_placeholder')}
              readOnly={readOnly}
            />
          )}
        />
        {/* Nhân viên ghi nhận */}
        <form.AppField
          name='detectedBy'
          children={(field) => <field.TextField label={t('issue:recorder')} readOnly />}
        />
        {/* Ngày phát hành */}
        <form.AppField
          name='issueDate'
          children={(field) => (
            <field.DatePickerField label={t('issue:issue_date')} required readOnly={readOnly} />
          )}
        />
        {/* Mã phiếu */}
        <form.AppField
          name='documentNo'
          children={(field) => (
            <field.TextField
              label={t('issue:issue_code')}
              placeholder={t('issue:issue_code_placeholder')}
              readOnly
            />
          )}
        />
      </div>

      {/* Thông tin ghi nhận */}
      <h2 className='border-b font-semibold capitalize'>{t('issue:record_info_title')}</h2>
      <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
        {/* Job no */}
        <form.AppField
          name='jobOrderNo'
          children={(field) => (
            <field.TextField
              label={t('issue:job_no')}
              placeholder={t('issue:job_no_placeholder')}
              readOnly={readOnly}
            />
          )}
        />
        {/* Phân loại */}
        <form.AppField
          name='issueCategory'
          children={(field) => (
            <field.SelectField
              label={t('issue:category')}
              required
              options={categoryOptions}
              placeholder={t('issue:category_placeholder')}
              readOnly={readOnly}
            />
          )}
        />
        {/* Phát hiện trên */}
        <form.AppField
          name='itemCategory'
          children={(field) => (
            <field.SelectField
              label={t('issue:detection_type')}
              required
              options={detectionTypeOptions}
              placeholder={t('issue:detection_type_placeholder')}
              readOnly={readOnly}
            />
          )}
        />
        {/* Mã sản phẩm */}
        <form.AppField
          name='itemCode'
          children={(field) => (
            <field.TextField
              label={t('issue:product_code')}
              required
              placeholder={t('issue:product_code_placeholder')}
              readOnly={readOnly}
            />
          )}
        />
        {/* Công đoạn phát hiện */}
        <form.AppField
          name='detectionStage'
          children={(field) => (
            <field.ComboboxField
              label={t('issue:detection_process')}
              required
              options={processOptions}
              placeholder={t('issue:detection_process_placeholder')}
              readOnly={readOnly}
            />
          )}
        />
        {/* Tên lỗi */}
        <form.AppField
          name='detectionContent'
          children={(field) => (
            <field.ComboboxField
              label={t('issue:error_name')}
              required
              options={errorOptions}
              placeholder={t('issue:error_name_placeholder')}
              readOnly={readOnly}
              disabled={!readOnly && !selectedProcess}
            />
          )}
        />
        {/* Lot no */}
        <form.AppField
          name='lotNo'
          children={(field) => (
            <field.TextField
              label={t('issue:lot_no')}
              required
              placeholder={t('issue:lot_no_placeholder')}
              readOnly={readOnly}
            />
          )}
        />
        {/* Line */}
        <form.AppField
          name='lineNo'
          children={(field) => (
            <field.TextField
              label={t('issue:line')}
              required
              placeholder={t('issue:line_placeholder')}
              readOnly={readOnly}
            />
          )}
        />
        {/* Máy */}
        <form.AppField
          name='machineNo'
          children={(field) => (
            <field.TextField
              label={t('issue:machine')}
              required
              placeholder={t('issue:machine_placeholder')}
              readOnly={readOnly}
            />
          )}
        />
        {/* Keo */}
        <form.AppField
          name='glue'
          children={(field) => (
            <field.TextField
              label={t('issue:glue')}
              required
              placeholder={t('issue:glue_placeholder')}
              readOnly={readOnly}
            />
          )}
        />
        {/* Cao su */}
        <form.AppField
          name='rubber'
          children={(field) => (
            <field.TextField
              label={t('issue:rubber')}
              required
              placeholder={t('issue:rubber_placeholder')}
              readOnly={readOnly}
            />
          )}
        />
        {/* Batch */}
        <form.AppField
          name='batchNo'
          children={(field) => (
            <field.TextField
              label={t('issue:batch')}
              required
              placeholder={t('issue:batch_placeholder')}
              readOnly={readOnly}
            />
          )}
        />
        {/* Số lượng */}
        <form.AppField
          name='detectedQuantity'
          children={(field) => (
            <field.NumberField
              label={t('issue:quantity')}
              required
              placeholder={t('issue:quantity_placeholder')}
              readOnly={readOnly}
            />
          )}
        />
        {/* Vị trí vùng bất thường */}
        <form.AppField
          name='abnormalArea'
          children={(field) => (
            <field.SelectField
              label={t('issue:anomaly_location')}
              required
              options={anomalyLocationOptions}
              placeholder={t('issue:anomaly_location_placeholder')}
              readOnly={readOnly}
            />
          )}
        />
        {/* Bình thường */}
        <form.AppField
          name='normalDescription'
          children={(field) => (
            <field.TextareaField
              label={t('issue:normal_condition')}
              required
              placeholder={t('issue:normal_condition_placeholder')}
              rows={4}
              readOnly={readOnly}
            />
          )}
        />
        {/* Bất thường */}
        <form.AppField
          name='abnormalDescription'
          children={(field) => (
            <field.TextareaField
              label={t('issue:abnormal_condition')}
              required
              placeholder={t('issue:abnormal_condition_placeholder')}
              rows={4}
              readOnly={readOnly}
            />
          )}
        />
      </div>
    </form>
  );
}
