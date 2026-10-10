export interface UserInfo {
  username: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
}

export interface RefreshResponse {
  token: string;
}
