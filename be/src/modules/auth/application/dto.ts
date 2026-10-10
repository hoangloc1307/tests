import type { UserInfo } from 'shared/types/auth';

/** Application-layer DTOs — the shape of data crossing the use-case boundary. */

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}

export interface RefreshResult {
  accessToken: string;
}
