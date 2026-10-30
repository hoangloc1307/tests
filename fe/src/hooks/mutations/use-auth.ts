import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import type {
  CreateRoleInput,
  DeleteRoleInput,
  LoginInput,
  LoginWithCardInput,
  UpdateRoleInput,
} from 'shared/schemas/auth';
import { authApi } from '~/apis/auth';
import { toast } from '~/components/ui/toast';
import PATHS from '~/constants/paths';
import { authQueries } from '~/hooks/queries/auth.queries';
import { useAuthStore } from '~/stores/auth';

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
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

export function useCreateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRoleInput) => authApi.createUserRole(payload),
    onSuccess: (data) => {
      toast.add({ type: 'success', title: data.message });
      queryClient.invalidateQueries({ queryKey: authQueries.userRoles().queryKey });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRoleInput) => authApi.updateUserRole(payload),
    onSuccess: (data) => {
      toast.add({ type: 'success', title: data.message });
      queryClient.invalidateQueries({ queryKey: authQueries.userRoles().queryKey });
    },
  });
}

export function useDeleteUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteRoleInput) => authApi.deleteUserRole(payload),
    onSuccess: (data) => {
      toast.add({ type: 'success', title: data.message });
      queryClient.invalidateQueries({ queryKey: authQueries.userRoles().queryKey });
    },
  });
}

export function useLoginWithCard() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
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
