import { IconDeviceFloppy, IconPencil, IconTrash, IconUserPentagon } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createRoleSchema } from 'shared/schemas/auth';
import type { RoleListItem } from 'shared/types/auth';
import { Button } from '~/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { useCreateUserRole } from '~/hooks/mutations/use-auth';
import { authQueries } from '~/hooks/queries/auth.queries';
import { hrQueries } from '~/hooks/queries/hr.queries';
import { masterQueries } from '~/hooks/queries/master.queries';
import { useAppForm } from '~/hooks/use-app-form';
import { DeleteRoleDialog } from '~/views/pages/role/delete-role-dialog';
import { EditRoleDialog } from '~/views/pages/role/edit-role-dialog';

const EMPTY_SECTION_ID = '0000';

export default function RolePage() {
  const { t } = useTranslation('auth');

  const { data: roles = [] } = useQuery(masterQueries.roles());
  const { data: sections = [] } = useQuery(hrQueries.sections());
  const { data: userRoles = [] } = useQuery(authQueries.userRoles());
  const createUserRole = useCreateUserRole();

  const [editItem, setEditItem] = useState<RoleListItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<RoleListItem | null>(null);

  // Tạo danh sách options
  const roleOptions = roles
    .filter((r) => !r.IsSystemRole)
    .map((r) => ({ value: r.RoleId, label: r.RoleName }));

  const sectionOptions = sections.map((s) => ({
    value: s.SectionId,
    label: `${s.SectionId} - ${s.Name}`,
  }));

  // Map id -> tên hiển thị
  const roleNameById = useMemo(() => new Map(roles.map((r) => [r.RoleId, r.RoleName])), [roles]);
  const sectionNameById = useMemo(
    () => new Map(sections.map((s) => [s.SectionId, s.Name])),
    [sections],
  );

  const form = useAppForm({
    defaultValues: {
      username: '',
      roleId: '',
      sectionId: '',
    },
    validators: {
      onSubmit: createRoleSchema.omit({ roleName: true }),
    },
    onSubmit: async ({ value, formApi }) => {
      await createUserRole.mutateAsync({
        ...value,
        roleName: roleNameById.get(value.roleId) ?? '',
      });
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

      {/* Danh sách phân quyền */}
      <div className='space-y-2'>
        <h2 className='text-foreground text-lg font-semibold'>{t('permission.list_title')}</h2>
        <div className='rounded-lg border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('permission.table.employee_code')}</TableHead>
                <TableHead>{t('permission.table.employee_name')}</TableHead>
                <TableHead>{t('permission.table.role')}</TableHead>
                <TableHead>{t('permission.table.section')}</TableHead>
                <TableHead>{t('permission.table.updated_at')}</TableHead>
                <TableHead className='text-right'>{t('permission.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='text-muted-foreground py-6 text-center'>
                    {t('permission.table.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                userRoles.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className='font-medium'>{item.username}</TableCell>
                    <TableCell>
                      <span className='inline-flex items-center gap-1.5'>
                        {item.isAdmin && (
                          <IconUserPentagon className='text-primary size-4 shrink-0' />
                        )}
                        {item.displayName ?? '-'}
                      </span>
                    </TableCell>
                    <TableCell>{roleNameById.get(item.roleId) ?? item.roleId}</TableCell>
                    <TableCell>
                      {item.sectionId === EMPTY_SECTION_ID
                        ? null
                        : sectionNameById.get(item.sectionId)
                          ? `${item.sectionId} - ${sectionNameById.get(item.sectionId)}`
                          : item.sectionId}
                    </TableCell>
                    <TableCell>
                      {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell>
                      {!item.isAdmin && (
                        <div className='flex justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon-sm'
                            aria-label={t('common:edit')}
                            onClick={() => setEditItem(item)}
                          >
                            <IconPencil />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon-sm'
                            aria-label={t('common:delete')}
                            onClick={() => setDeleteItem(item)}
                          >
                            <IconTrash className='text-destructive' />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <EditRoleDialog
        key={editItem?.id}
        item={editItem}
        roleOptions={roleOptions}
        sectionOptions={sectionOptions}
        onOpenChange={(open) => !open && setEditItem(null)}
      />
      <DeleteRoleDialog item={deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)} />
    </div>
  );
}
