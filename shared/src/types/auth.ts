export interface UserInfo {
  username: string;
  name: string;
}

export interface UserRoleInfo {
  role: string;
  section: string;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
  roles: UserRoleInfo[];
  permissions: string[];
  vnnToken: string;
}

export interface RefreshResponse {
  token: string;
}

export interface RoleListItem {
  id: string;
  username: string;
  displayName: string | null;
  roleId: string;
  sectionId: string;
  createdAt: string | null;
  updatedAt: string | null;
}
