import type { Router } from 'express';
import { ENDPOINTS } from 'shared/constants/endpoints';
import { createAuthRouter } from '~/modules/auth/presentation/auth.composition';
import { createIssueRouter } from '~/modules/issue/presentation/issue.composition';

interface ModuleConfig {
  path: string;
  router: Router;
  isPublic?: boolean;
}

export const buildModules = (): ModuleConfig[] => {
  const authRouter = createAuthRouter();
  const issueRouter = createIssueRouter();

  return [
    { path: ENDPOINTS.AUTH.PREFIX, router: authRouter, isPublic: true },
    { path: ENDPOINTS.ISSUE.PREFIX, router: issueRouter },
  ];
};
