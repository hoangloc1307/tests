import { IconLogin2, IconLogout2, IconUserCircle, IconUserQuestion } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import PATHS from '~/constants/paths';
import { useAuthStore } from '~/stores/auth';

export default function UserOption() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = () => {
    navigate(PATHS.LOGIN);
    setAuth({
      token: '123',
      user: {
        name: 'Trần Nguyễn Hoàng Lộc',
        username: '12314092',
      },
    });
  };

  const handleLogout = () => {
    logout();
    navigate(PATHS.LOGIN);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className='overflow-hidden'>
          <AvatarImage
            src={`https://v033.nok.com.vn/shared/images/${user?.username}.jpg`}
            alt={user?.name ?? t('auth:guest_user')}
            className='object-fill'
          />
          <AvatarFallback className='rounded-lg'>
            {user?.name?.slice(0, 2).toUpperCase() ?? <IconUserQuestion className='size-5' />}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='min-w-56 rounded-lg'
        side={'bottom'}
        align='end'
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className='text-popover-foreground grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-medium capitalize'>
                {user?.name ?? t('auth:guest_user')}
              </span>
              <span className='truncate text-xs font-normal italic'>
                {user?.username ?? t('auth:login_for_full_access')}
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {user && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate(PATHS.PROFILE)}>
                <IconUserCircle />
                {t('auth:profile')}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout2 />
              {t('auth:logout')}
            </DropdownMenuItem>
          </>
        )}

        {!user && (
          <DropdownMenuItem onClick={handleLogin}>
            <IconLogin2 />
            {t('auth:login')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
