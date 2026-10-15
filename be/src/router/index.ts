import type { Router } from 'express';
import { ENDPOINTS } from 'shared/constants/endpoints';
import { createAuthRouter } from '~/modules/auth/presentation/auth.composition';

interface ModuleConfig {
  path: string;
  router: Router;
  isPublic?: boolean;
}

export const buildModules = (): ModuleConfig[] => {
  const authRouter = createAuthRouter();

  return [{ path: ENDPOINTS.AUTH.PREFIX, router: authRouter, isPublic: true }];
};
