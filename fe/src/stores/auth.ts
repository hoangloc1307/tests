import type { UserInfo } from 'shared/types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import STORAGE_KEYS from '~/constants/storage-keys';

interface AuthData {
  token: string;
  user: UserInfo;
  roles: string[];
  permissions: string[];
}

interface AuthState {
  token: string | null;
  user: UserInfo | null;
  roles: string[];
  permissions: string[];
  setAuth: (data: AuthData) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      roles: [],
      permissions: [],
      setAuth: ({ token, user, roles, permissions }) => set({ token, user, roles, permissions }),
      setToken: (token) => set({ token }),
      logout: () => set({ token: null, user: null, roles: [], permissions: [] }),
    }),
    { name: STORAGE_KEYS.AUTH },
  ),
);
