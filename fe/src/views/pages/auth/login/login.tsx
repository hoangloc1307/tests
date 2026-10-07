import { useTranslation } from 'react-i18next';
import { loginSchema, type LoginInput } from 'shared/schemas/auth';
import { FieldGroup } from '~/components/ui/field';
import { useLogin } from '~/hooks/mutations/use-auth';
import { useAppForm } from '~/hooks/use-app-form';

export default function LoginPage() {
  const { t } = useTranslation();
  const { mutateAsync } = useLogin();

  const form = useAppForm({
    defaultValues: {
      username: '',
      password: '',
    } satisfies LoginInput,
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value);
    },
  });

  return (
    <form
      className='p-6 md:p-8'
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className='flex flex-col items-center gap-2 text-center'>
        <h2 className='text-2xl font-bold'>{t('welcome')}</h2>
        <p className='text-muted-foreground text-balance'>{t('loginToVNN')}</p>
      </div>
      <FieldGroup className='mt-4'>
        <form.AppField
          name='username'
          children={(field) => <field.TextField label={t('username')} />}
        />
        <form.AppField
          name='password'
          children={(field) => <field.TextField label={t('password')} type='password' />}
        />
        <form.AppForm>
          <form.SubmitButton>{t('login')}</form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
