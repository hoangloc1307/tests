import type { UserInfo } from 'shared/types/auth';

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
  roles: string[];
  permissions: string[];
}
