export interface UserInfo {
  username: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
  roles: string[];
  permissions: string[];
  vnnToken: string;
}

export interface RefreshResponse {
  token: string;
}

export interface RoleResponse {
  username: string;
  roleId: string;
  sectionId: string;
}
