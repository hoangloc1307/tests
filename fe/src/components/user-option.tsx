import { IconLogout2, IconUserCircle, IconLogin2 } from '@tabler/icons-react';
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
import { useAuthStore } from '~/stores/auth';

export default function UserOption() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className='overflow-hidden'>
          <AvatarImage
            src={`https://v033.nok.com.vn/shared/images/${user?.username}.jpg`}
            alt={user?.name ?? 'Anonymous User'}
            className='object-fill'
          />
          <AvatarFallback className='rounded-lg'>
            {user?.name?.slice(0, 2).toUpperCase() ?? 'AU'}
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
              <span className='truncate font-medium'>{user?.name ?? 'Anonymous User'}</span>
              <span className='truncate text-xs font-normal'>{user?.username}</span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {user && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <IconUserCircle />
                {t('profile')}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout2 />
              {t('logout')}
            </DropdownMenuItem>
          </>
        )}

        {!user && (
          <DropdownMenuItem onClick={handleLogin}>
            <IconLogin2 />
            {t('login')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
