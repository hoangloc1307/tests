import type { UserInfo, UserRoleInfo } from 'shared/types/auth';

export interface LoginResult {
  vnnToken: string;
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
  roles: UserRoleInfo[];
  permissions: string[];
}
