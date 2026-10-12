import type { UserInfo } from 'shared/types/auth';

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}

export interface RefreshResult {
  accessToken: string;
}
