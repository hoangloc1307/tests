import { useNavigate } from 'react-router';
import type { LoginInput, LoginWithCardInput } from 'shared/schemas/auth';
import { authApi } from '~/apis/auth';
import PATHS from '~/constants/paths';
import { useAppMutation } from '~/hooks/use-app-mutation';
import { useAuthStore } from '~/stores/auth';

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useAppMutation({
    mutationFn: (payload: LoginInput) => authApi.login(payload),
    onSuccess: (data) => {
      if (data.data) {
        setAuth({
          token: data.data.token,
          user: data.data.user,
          roles: data.data.roles,
          permissions: data.data.permissions,
          vnnToken: data.data.vnnToken,
        });
        navigate(PATHS.HOME, { replace: true });
      }
    },
  });
}

export function useLoginWithCard() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useAppMutation({
    mutationFn: (payload: LoginWithCardInput) => authApi.loginWithCard(payload),
    onSuccess: (data) => {
      if (data.data) {
        setAuth({
          token: data.data.token,
          user: data.data.user,
          roles: data.data.roles,
          permissions: data.data.permissions,
          vnnToken: data.data.vnnToken,
        });
        navigate(PATHS.HOME, { replace: true });
      }
    },
  });
}
