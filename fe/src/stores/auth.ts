import type { UserInfo } from 'shared/types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import STORAGE_KEYS from '~/constants/storage-keys';

interface AuthState {
  token: string | null;
  user: UserInfo | null;
  setAuth: (data: { token: string; user: UserInfo }) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: ({ token, user }) => set({ token, user }),
      setToken: (token) => set({ token }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: STORAGE_KEYS.AUTH },
  ),
);
