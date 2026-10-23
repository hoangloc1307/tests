import { IconDeviceFloppy } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { createRoleSchema } from 'shared/schemas/auth';
import { useCreateUserRole } from '~/hooks/mutations/use-auth';
import { hrQueries } from '~/hooks/queries/hr.queries';
import { masterQueries } from '~/hooks/queries/master.queries';
import { useAppForm } from '~/hooks/use-app-form';

export default function RolePage() {
  const { t } = useTranslation('auth');

  const { data: roles = [] } = useQuery(masterQueries.roles());
  const { data: sections = [] } = useQuery(hrQueries.sections());
  const createUserRole = useCreateUserRole();

  // Tạo danh sách options
  const roleOptions = roles
    .filter((r) => !r.IsSystemRole)
    .map((r) => ({ value: r.RoleId, label: r.RoleName }));

  const sectionOptions = sections.map((s) => ({
    value: s.SectionId,
    label: `${s.SectionId} - ${s.Name}`,
  }));

  const form = useAppForm({
    defaultValues: {
      username: '',
      roleId: '',
      sectionId: '',
    },
    validators: {
      onSubmit: createRoleSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await createUserRole.mutateAsync(value);
      formApi.reset();
    },
  });

  return (
    <div className='space-y-4'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-foreground text-2xl font-bold capitalize'>
          {t('navigation:settings_role')}
        </h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className='grid grid-cols-2 gap-4 space-y-4 md:grid-cols-3 lg:grid-cols-4'
      >
        {/* Mã nhân viên */}
        <form.AppField
          name='username'
          children={(field) => (
            <field.TextField
              label={t('permission.employee_code')}
              placeholder={t('permission.employee_code_placeholder')}
              required
            />
          )}
        />
        {/* Role (lấy từ master /rbac roles) */}
        <form.AppField
          name='roleId'
          children={(field) => (
            <field.SelectField
              label={t('permission.role')}
              options={roleOptions}
              placeholder={t('permission.role_placeholder')}
              required
            />
          )}
        />
        {/* Bộ phận */}
        <form.AppField
          name='sectionId'
          children={(field) => (
            <field.ComboboxField
              label={t('permission.section')}
              options={sectionOptions}
              placeholder={t('permission.section_placeholder')}
              required
            />
          )}
        />
        <form.AppForm>
          <form.SubmitButton className='mt-1.5 w-fit self-center'>
            <IconDeviceFloppy data-icon='inline-start' /> {t('common:save')}
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </div>
  );
}
