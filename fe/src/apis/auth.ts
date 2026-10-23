import { ENDPOINTS } from 'shared/constants/endpoints';
import type {
  CreateRoleInput,
  DeleteRoleInput,
  LoginInput,
  LoginWithCardInput,
  UpdateRoleInput,
} from 'shared/schemas/auth';
import type { ApiResponse } from 'shared/types/api';
import type { LoginResponse, RoleListItem } from 'shared/types/auth';
import api from '~/lib/axios';
import { buildUrl } from '~/lib/utils';

const login = async (payload: LoginInput): Promise<ApiResponse<LoginResponse>> =>
  await api.post<ApiResponse<LoginResponse>>(
    buildUrl(ENDPOINTS.AUTH.PREFIX, ENDPOINTS.AUTH.LOGIN),
    payload,
  );

const loginWithCard = async (payload: LoginWithCardInput): Promise<ApiResponse<LoginResponse>> =>
  await api.post<ApiResponse<LoginResponse>>(
    buildUrl(ENDPOINTS.AUTH.PREFIX, ENDPOINTS.AUTH.LOGIN_WITH_CARD),
    payload,
  );

const logout = async (): Promise<ApiResponse<null>> =>
  await api.post<ApiResponse<null>>(buildUrl(ENDPOINTS.AUTH.PREFIX, ENDPOINTS.AUTH.LOGOUT));

const createUserRole = async (payload: CreateRoleInput): Promise<ApiResponse<null>> =>
  await api.post<ApiResponse<null>>(buildUrl(ENDPOINTS.AUTH.PREFIX, ENDPOINTS.AUTH.ROLES), payload);

const getUserRoles = async (): Promise<ApiResponse<RoleListItem[]>> =>
  await api.get<ApiResponse<RoleListItem[]>>(buildUrl(ENDPOINTS.AUTH.PREFIX, ENDPOINTS.AUTH.ROLES));

const updateUserRole = async (payload: UpdateRoleInput): Promise<ApiResponse<null>> =>
  await api.patch<ApiResponse<null>>(
    buildUrl(ENDPOINTS.AUTH.PREFIX, ENDPOINTS.AUTH.ROLES),
    payload,
  );

const deleteUserRole = async (payload: DeleteRoleInput): Promise<ApiResponse<null>> =>
  await api.delete<ApiResponse<null>>(buildUrl(ENDPOINTS.AUTH.PREFIX, ENDPOINTS.AUTH.ROLES), {
    data: payload,
  });

export const authApi = {
  login,
  loginWithCard,
  logout,
  createUserRole,
  getUserRoles,
  updateUserRole,
  deleteUserRole,
};
