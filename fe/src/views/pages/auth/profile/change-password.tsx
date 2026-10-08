import { useTranslation } from 'react-i18next';
import { changePasswordSchema } from 'shared/schemas/auth';
import { useAppForm } from '~/hooks/use-app-form';

export default function ChangePassword() {
  const { t } = useTranslation();

  const form = useAppForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: changePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      //   await mutateAsync(value);
      console.log(value);
      form.reset();
    },
  });

  return (
    <div className='bg-popover rounded-xl border p-6'>
      <h3 className='text-foreground text-lg font-semibold'>{t('auth:change_password')}</h3>
      <p className='text-muted-foreground mt-1 text-sm'>{t('auth:change_password_description')}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className='mt-6 space-y-4'
      >
        <form.AppField name='currentPassword'>
          {(field) => (
            <field.TextField
              label={t('auth:current_password')}
              type='password'
              required
              autoComplete='current-password'
            />
          )}
        </form.AppField>

        <form.AppField name='newPassword'>
          {(field) => (
            <field.TextField
              label={t('auth:new_password')}
              type='password'
              required
              autoComplete='new-password'
            />
          )}
        </form.AppField>

        <form.AppField name='confirmPassword'>
          {(field) => (
            <field.TextField
              label={t('auth:confirm_password')}
              type='password'
              required
              autoComplete='new-password'
            />
          )}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton>{t('auth:change_password')}</form.SubmitButton>
        </form.AppForm>
      </form>
    </div>
  );
}
