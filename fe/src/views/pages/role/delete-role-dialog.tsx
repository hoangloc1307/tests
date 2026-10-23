import { IconTrash, IconX } from '@tabler/icons-react';
import { Trans, useTranslation } from 'react-i18next';
import type { RoleListItem } from 'shared/types/auth';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { useDeleteUserRole } from '~/hooks/mutations/use-auth';

interface DeleteRoleDialogProps {
  item: RoleListItem | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteRoleDialog({ item, onOpenChange }: DeleteRoleDialogProps) {
  const { t } = useTranslation('auth');
  const deleteUserRole = useDeleteUserRole();

  const handleDelete = async () => {
    if (!item) return;
    await deleteUserRole.mutateAsync({ id: item.id });
    onOpenChange(false);
  };

  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('permission.delete_confirm_title')}</DialogTitle>
          <DialogDescription>
            <Trans
              i18nKey='permission.delete_confirm_description'
              ns='auth'
              values={{
                name: item?.displayName ? `${item.username} - ${item.displayName}` : item?.username,
              }}
              components={{ bold: <span className='text-foreground font-semibold' /> }}
            />
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
            <IconX data-icon='inline-start' /> {t('common:cancel')}
          </Button>
          <Button
            type='button'
            variant='destructive'
            disabled={deleteUserRole.isPending}
            onClick={handleDelete}
          >
            <IconTrash data-icon='inline-start' />
            {t('common:delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
