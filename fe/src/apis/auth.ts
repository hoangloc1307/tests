import { ENDPOINTS } from 'shared/constants/endpoints';
import type { LoginInput, LoginWithCardInput } from 'shared/schemas/auth';
import type { ApiResponse } from 'shared/types/api';
import type { LoginResponse } from 'shared/types/auth';
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

export const authApi = {
  login,
  loginWithCard,
  logout,
};
