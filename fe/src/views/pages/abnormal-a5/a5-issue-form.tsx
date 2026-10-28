import { useSelector } from '@tanstack/react-form';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { AbnormalAreaEnum, IssueCategoryEnum, ItemCategoryEnum } from 'shared/schemas/issue';
import { useErrors } from '~/hooks/use-errors';
import { useProcesses } from '~/hooks/use-processes';
import { useSections } from '~/hooks/use-sections';
import type { A5IssueForm as A5IssueFormInstance } from '~/views/pages/abnormal-a5/use-a5-issue-form';

interface A5IssueFormProps {
  form: A5IssueFormInstance;
  title: ReactNode;
  readOnly?: boolean;
  actions?: ReactNode;
}

export default function A5IssueForm({ form, title, readOnly = false, actions }: A5IssueFormProps) {
  const { t } = useTranslation();
  const { sectionOptions } = useSections();
  const { processOptions } = useProcesses();

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
        {actions}
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
        {/* Ngày phát hành */}
        <form.AppField
          name='issueDate'
          children={(field) => (
            <field.DatePickerField label={t('issue:issue_date')} required readOnly={readOnly} />
          )}
        />
        {/* Nhân viên phát hiện */}
        <form.AppField
          name='detectedBy'
          children={(field) => (
            <field.TextField
              label={t('issue:detector')}
              required
              placeholder={t('issue:detector_placeholder')}
              readOnly={readOnly}
            />
          )}
        />
        {/* Nhân viên kiểm tra */}
        <form.AppField
          name='checkedBy'
          children={(field) => (
            <field.TextField
              label={t('issue:checker')}
              required
              placeholder={t('issue:checker_placeholder')}
              readOnly={readOnly}
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
