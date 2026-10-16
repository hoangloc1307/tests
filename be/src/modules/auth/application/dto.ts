import type { UserInfo } from 'shared/types/auth';

export interface LoginResult {
  vnnToken: string;
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
  roles: string[];
  permissions: string[];
}
