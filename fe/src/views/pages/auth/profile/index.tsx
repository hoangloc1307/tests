import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import ChangePassword from '~/views/pages/auth/profile/change-password';

export default function ProfilePage() {
  const { t } = useTranslation();

  const profile = {
    username: 12314092,
    name: 'Trần Nguyễn Hoàng Lộc',
    email: 'tran.nguyen.hoang.loc@vnn.nokgrp.com',
    roles: [
      {
        roleCode: 'Staff',
        roleName: 'Nhân viên nghiệp vụ',
        section: '2120 - System',
      },
    ],
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-foreground text-2xl font-bold'>{t('auth:profile_title')}</h2>

      <div className='grid gap-6 lg:grid-cols-2'>
        <div className='bg-popover rounded-xl border p-6'>
          <h3 className='text-foreground text-lg font-semibold'>{t('auth:info')}</h3>
          <p className='text-muted-foreground mt-1 text-sm'>{t('auth:info_description')}</p>

          <div className='mt-6 flex items-center gap-4'>
            <Avatar className='h-16 w-16'>
              <AvatarImage
                src={`https://v033.nok.com.vn/shared/images/${profile?.username}.jpg`}
                alt={profile?.name}
                className='object-fill'
              />
              <AvatarFallback className='text-lg' style={{ backgroundColor: '#E57373' }}>
                {profile?.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='space-y-1'>
              <p className='text-foreground text-lg font-medium'>{profile?.name}</p>
              <p className='text-muted-foreground text-sm'>{profile?.username}</p>
            </div>
          </div>

          {profile?.roles && profile.roles.length > 0 && (
            <div className='mt-6'>
              <p className='font-semibold'>{t('auth:role')}</p>
              <div className='mt-2 flex flex-wrap gap-2'>
                {profile.roles.map((role) => (
                  <Badge key={`${role.roleCode}-${role.section}`} variant='secondary'>
                    {role.roleName}
                    {role.section && (
                      <span className='text-muted-foreground ml-1'>({role.section})</span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <ChangePassword />
      </div>
    </div>
  );
}
