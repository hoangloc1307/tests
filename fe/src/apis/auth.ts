import { ENDPOINTS } from 'shared/constants/endpoints';
import type { LoginInput, LoginWithCardInput } from 'shared/schemas/auth';
import type { ApiResponse } from 'shared/types/api';
import type { LoginResponse } from 'shared/types/auth';
import api from '~/lib/axios';

const login = async (payload: LoginInput): Promise<ApiResponse<LoginResponse>> =>
  await api.post<ApiResponse<LoginResponse>>(`${ENDPOINTS.AUTH}/login`, payload);

const loginWithCard = async (payload: LoginWithCardInput): Promise<ApiResponse<LoginResponse>> =>
  await api.post<ApiResponse<LoginResponse>>(`${ENDPOINTS.AUTH}/login-with-card`, payload);

export const authApi = {
  login,
  loginWithCard,
};
