import { IconDeviceFloppy } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { createIssueSchema } from 'shared/schemas/issue';
import { hrQueries } from '~/hooks/queries/hr.queries';
import { useAppForm } from '~/hooks/use-app-form';
import { useAuthStore } from '~/stores/auth';

export default function NewIssuePage() {
  const { t } = useTranslation('issue');
  const { data: sections = [] } = useQuery(hrQueries.sections());
  const user = useAuthStore((s) => s.user);

  const form = useAppForm({
    defaultValues: {
      issueCode: '',
      issueSection: '',
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

  const sectionOptions = sections.map((s) => ({
    label: `${s.SectionId} - ${s.Name}`,
    value: s.SectionId,
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
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
    </form>
  );
}
