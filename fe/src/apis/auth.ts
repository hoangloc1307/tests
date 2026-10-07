import { ENDPOINTS } from 'shared/constants/endpoints';
import type { LoginInput } from 'shared/schemas/auth';
import type { ApiResponse } from 'shared/types/api';
import type { LoginResponse } from 'shared/types/auth';
import api from '~/lib/axios';

const login = async (payload: LoginInput): Promise<ApiResponse<LoginResponse>> =>
  await api.post<ApiResponse<LoginResponse>>(`${ENDPOINTS.AUTH}/login`, payload);

export const authApi = {
  login,
};
