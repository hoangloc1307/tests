export interface UserInfo {
  username: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
}
