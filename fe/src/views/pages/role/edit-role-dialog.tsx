import { IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { updateRoleSchema } from 'shared/schemas/auth';
import type { RoleListItem } from 'shared/types/auth';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { useUpdateUserRole } from '~/hooks/mutations/use-auth';
import { useAppForm } from '~/hooks/use-app-form';

interface Option {
  value: string;
  label: string;
}

interface EditRoleDialogProps {
  item: RoleListItem | null;
  roleOptions: Option[];
  sectionOptions: Option[];
  onOpenChange: (open: boolean) => void;
}

export function EditRoleDialog({
  item,
  roleOptions,
  sectionOptions,
  onOpenChange,
}: EditRoleDialogProps) {
  const { t } = useTranslation();
  const updateUserRole = useUpdateUserRole();

  const form = useAppForm({
    defaultValues: {
      roleId: item?.roleId ?? '',
      sectionId: item?.sectionId ?? '',
    },
    validators: {
      onSubmit: updateRoleSchema.pick({ roleId: true, sectionId: true }),
    },
    onSubmit: async ({ value }) => {
      if (!item) return;
      await updateUserRole.mutateAsync({
        id: item.id,
        roleId: value.roleId,
        sectionId: value.sectionId,
      });
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('auth:permission.edit_title')}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className='flex flex-col gap-4'
        >
          <div className='text-sm'>
            <span className='text-muted-foreground'>{t('auth:permission.employee_code')}: </span>
            <span className='font-medium'>{item?.username}</span>
            {item?.displayName ? ` - ${item.displayName}` : ''}
          </div>

          <form.AppField
            name='roleId'
            children={(field) => (
              <field.SelectField
                label={t('auth:permission.role')}
                options={roleOptions}
                placeholder={t('auth:permission.role_placeholder')}
                required
              />
            )}
          />

          <form.AppField
            name='sectionId'
            children={(field) => (
              <field.ComboboxField
                label={t('auth:permission.section')}
                options={sectionOptions}
                placeholder={t('auth:permission.section_placeholder')}
                required
              />
            )}
          />

          <div className='flex justify-end gap-2'>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              <IconX data-icon='inline-start' /> {t('common:cancel')}
            </Button>
            <form.AppForm>
              <form.SubmitButton>
                <IconDeviceFloppy data-icon='inline-start' /> {t('common:save')}
              </form.SubmitButton>
            </form.AppForm>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
