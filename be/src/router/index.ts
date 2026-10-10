import type { Router } from 'express';
import { ENDPOINTS } from 'shared/constants/endpoints';
import { createAuthRouter } from '~/modules/auth/presentation/auth.composition';

interface ModuleConfig {
  path: string;
  router: Router;
  isPublic?: boolean;
}

/**
 * Builds the list of mounted modules. Module routers are produced by their
 * composition roots (which wire use cases to infrastructure), so this is async.
 */
export const buildModules = async (): Promise<ModuleConfig[]> => {
  const authRouter = await createAuthRouter();

  return [{ path: ENDPOINTS.AUTH, router: authRouter, isPublic: true }];
};
