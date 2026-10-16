import { IconDeviceFloppy } from '@tabler/icons-react';
import { useSelector } from '@tanstack/react-form';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import {
  createIssueSchema,
  DetectionTypeEnum,
  IssueCategoryEnum,
  AnomalyLocationEnum,
} from 'shared/schemas/issue';
import { hrQueries } from '~/hooks/queries/hr.queries';
import { masterQueries } from '~/hooks/queries/master.queries';
import { useAppForm } from '~/hooks/use-app-form';
import { useAuthStore } from '~/stores/auth';

export default function NewIssuePage() {
  const { t, i18n } = useTranslation('issue');
  const { data: sections = [] } = useQuery(hrQueries.sections());
  const { data: processes = [] } = useQuery(masterQueries.processes());
  const user = useAuthStore((s) => s.user);

  const form = useAppForm({
    defaultValues: {
      issueCode: '',
      issueSection: '',
      category: '',
      detectionType: '',
      productCode: '',
      lotNo: '',
      line: '',
      machine: '',
      glue: '',
      rubber: '',
      batch: '',
      quantity: null as number | null,
      jobNo: '',
      detectionProcess: '',
      errorCode: '',
      anomalyLocation: '',
      normalCondition: '',
      abnormalCondition: '',
      recorder: user ? `${user.username} - ${user.name}` : '',
      issueDate: format(new Date(), 'yyyy-MM-dd'),
    },
    validators: {
      onSubmit: createIssueSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  const selectedProcess = useSelector(form.store, (state) => state.values.detectionProcess);
  const { data: errors = [] } = useQuery(masterQueries.errorsByProcess(selectedProcess));

  const sectionOptions = sections.map((s) => ({
    label: `${s.SectionId} - ${s.Name}`,
    value: s.SectionId,
  }));

  const categoryOptions = IssueCategoryEnum.options.map((value) => ({
    value,
    label: t(`category_options.${value}`),
  }));

  const detectionTypeOptions = DetectionTypeEnum.options.map((value) => ({
    value,
    label: t(`detection_type_options.${value}`),
  }));

  const processOptions = processes.map((p) => {
    const lang = i18n.language;
    let label = p.OperationNameVI;
    if (lang === 'en') label = p.OperationNameEn;
    else if (lang === 'ja') label = p.OperationNameJp;
    return {
      value: p.ProcessId,
      label: `${p.ProcessId} - ${label}`,
    };
  });

  const errorOptions = errors.map((e) => {
    const lang = i18n.language;
    let label = e.NameVI;
    if (lang === 'en') label = e.NameEN;
    else if (lang === 'ja') label = e.NameJP;
    return {
      value: e.ErrorCode,
      label: `${e.ErrorCode} - ${label}`,
    };
  });

  const anomalyLocationOptions = AnomalyLocationEnum.options.map((value) => ({
    value,
    label: t(`anomaly_location_options.${value}`),
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
        <h1 className='text-foreground text-2xl font-bold capitalize'>
          {t('navigation:issue_create')}
        </h1>
        <form.AppForm>
          <form.SubmitButton>
            <IconDeviceFloppy data-icon='inline-start' /> {t('common:save')}
          </form.SubmitButton>
        </form.AppForm>
      </div>

      {/* Thông tin phát hành */}
      <h2 className='border-b font-semibold capitalize'>{t('info_title')}</h2>
      <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
        {/* Bộ phận phát hành */}
        <form.AppField
          name='issueSection'
          children={(field) => (
            <field.ComboboxField
              label={t('section')}
              required
              options={sectionOptions}
              placeholder={t('section_placeholder')}
            />
          )}
        />
        {/* Nhân viên ghi nhận */}
        <form.AppField
          name='recorder'
          children={(field) => <field.TextField label={t('recorder')} readOnly />}
        />
        {/* Ngày phát hành */}
        <form.AppField
          name='issueDate'
          children={(field) => <field.DatePickerField label={t('issue_date')} required />}
        />
        {/* Mã phiếu */}
        <form.AppField
          name='issueCode'
          children={(field) => (
            <field.TextField
              label={t('issue_code')}
              placeholder={t('issue_code_placeholder')}
              readOnly
            />
          )}
        />
      </div>

      {/* Thông tin ghi nhận */}
      <h2 className='border-b font-semibold capitalize'>{t('record_info_title')}</h2>
      <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
        {/* Job no */}
        <form.AppField
          name='jobNo'
          children={(field) => (
            <field.TextField label={t('job_no')} placeholder={t('job_no_placeholder')} />
          )}
        />
        {/* Phân loại */}
        <form.AppField
          name='category'
          children={(field) => (
            <field.SelectField
              label={t('category')}
              required
              options={categoryOptions}
              placeholder={t('category_placeholder')}
            />
          )}
        />
        {/* Phát hiện trên */}
        <form.AppField
          name='detectionType'
          children={(field) => (
            <field.SelectField
              label={t('detection_type')}
              required
              options={detectionTypeOptions}
              placeholder={t('detection_type_placeholder')}
            />
          )}
        />
        {/* Mã sản phẩm */}
        <form.AppField
          name='productCode'
          children={(field) => (
            <field.TextField
              label={t('product_code')}
              required
              placeholder={t('product_code_placeholder')}
            />
          )}
        />
        {/* Công đoạn phát hiện */}
        <form.AppField
          name='detectionProcess'
          children={(field) => (
            <field.ComboboxField
              label={t('detection_process')}
              required
              options={processOptions}
              placeholder={t('detection_process_placeholder')}
            />
          )}
        />
        {/* Tên lỗi */}
        <form.AppField
          name='errorCode'
          children={(field) => (
            <field.ComboboxField
              label={t('error_name')}
              required
              options={errorOptions}
              placeholder={t('error_name_placeholder')}
              disabled={!selectedProcess}
            />
          )}
        />
        {/* Lot no */}
        <form.AppField
          name='lotNo'
          children={(field) => (
            <field.TextField label={t('lot_no')} required placeholder={t('lot_no_placeholder')} />
          )}
        />
        {/* Line */}
        <form.AppField
          name='line'
          children={(field) => (
            <field.TextField label={t('line')} required placeholder={t('line_placeholder')} />
          )}
        />
        {/* Máy */}
        <form.AppField
          name='machine'
          children={(field) => (
            <field.TextField label={t('machine')} required placeholder={t('machine_placeholder')} />
          )}
        />
        {/* Keo */}
        <form.AppField
          name='glue'
          children={(field) => (
            <field.TextField label={t('glue')} required placeholder={t('glue_placeholder')} />
          )}
        />
        {/* Cao su */}
        <form.AppField
          name='rubber'
          children={(field) => (
            <field.TextField label={t('rubber')} required placeholder={t('rubber_placeholder')} />
          )}
        />
        {/* Batch */}
        <form.AppField
          name='batch'
          children={(field) => (
            <field.TextField label={t('batch')} required placeholder={t('batch_placeholder')} />
          )}
        />
        {/* Số lượng */}
        <form.AppField
          name='quantity'
          children={(field) => (
            <field.NumberField
              label={t('quantity')}
              required
              placeholder={t('quantity_placeholder')}
            />
          )}
        />
        {/* Vị trí vùng bất thường */}
        <form.AppField
          name='anomalyLocation'
          children={(field) => (
            <field.SelectField
              label={t('anomaly_location')}
              required
              options={anomalyLocationOptions}
              placeholder={t('anomaly_location_placeholder')}
            />
          )}
        />
        {/* Bình thường */}
        <form.AppField
          name='normalCondition'
          children={(field) => (
            <field.TextareaField
              label={t('normal_condition')}
              required
              placeholder={t('normal_condition_placeholder')}
              rows={4}
            />
          )}
        />
        {/* Bất thường */}
        <form.AppField
          name='abnormalCondition'
          children={(field) => (
            <field.TextareaField
              label={t('abnormal_condition')}
              required
              placeholder={t('abnormal_condition_placeholder')}
              rows={4}
            />
          )}
        />
      </div>
    </form>
  );
}
