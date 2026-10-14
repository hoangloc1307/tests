import { IconIdBadge2, IconLogin2 } from '@tabler/icons-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { loginSchema, type LoginInput } from 'shared/schemas/auth';
import { Button } from '~/components/ui/button';
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
        <h2 className='text-2xl font-bold capitalize'>{t('auth:welcome_back')}</h2>
        <p className='text-muted-foreground text-balance'>{t('auth:login_to_vnn')}.</p>
      </div>
      <FieldGroup className='mt-10'>
        <form.AppField
          name='username'
          children={(field) => <field.TextField label={t('auth:username')} required />}
        />
        <form.AppField
          name='password'
          children={(field) => (
            <field.TextField label={t('auth:password')} required type='password' />
          )}
        />
        <form.AppForm>
          <div className='flex flex-col gap-4'>
            <form.SubmitButton>
              <IconLogin2 data-icon='inline-start' />
              {t('auth:login_vnn')}
            </form.SubmitButton>
            <div className='relative text-center text-sm'>
              <span className='bg-background text-muted-foreground relative z-10 px-2'>
                {t('common:or')}
              </span>
              <div className='absolute inset-0 top-1/2 border-t' />
            </div>
            <Button
              variant='outline'
              nativeButton={false}
              render={
                <Link to='/login-with-card' className='flex items-center gap-1'>
                  <IconIdBadge2 />
                  {t('auth:login_member_card')}
                </Link>
              }
            />
          </div>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
