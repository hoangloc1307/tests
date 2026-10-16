import type { UserInfo } from 'shared/types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import STORAGE_KEYS from '~/constants/storage-keys';

interface AuthData {
  token: string;
  user: UserInfo;
  roles: string[];
  permissions: string[];
  vnnToken: string;
}

interface AuthState {
  token: string | null;
  user: UserInfo | null;
  roles: string[];
  permissions: string[];
  vnnToken: string | null;
  setAuth: (data: AuthData) => void;
  setToken: (token: string) => void;
  logout: () => void;
  hasPermission: (feature: string, action?: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      vnnToken: null,
      user: null,
      roles: [],
      permissions: [],
      setAuth: ({ token, user, roles, permissions, vnnToken }) =>
        set({ token, user, roles, permissions, vnnToken }),
      setToken: (token) => set({ token }),
      logout: () => set({ token: null, user: null, roles: [], permissions: [], vnnToken: null }),
      hasPermission: (feature, action) => {
        const { permissions } = get();
        if (action) {
          return permissions.includes(`${feature}:${action}`);
        }
        return permissions.some((p) => p.startsWith(`${feature}:`));
      },
    }),
    { name: STORAGE_KEYS.AUTH },
  ),
);
