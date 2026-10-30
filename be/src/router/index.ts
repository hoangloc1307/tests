import type { Router } from 'express';
import { ENDPOINTS } from 'shared/constants/endpoints';
import { createAuthRouter } from '~/modules/auth/presentation/auth.composition';
import { createIssueRouter } from '~/modules/issue/presentation/issue.composition';
import { createJobRouter } from '~/modules/job/presentation/job.composition';
import { createTaskRouter } from '~/modules/task/presentation/task.composition';

interface ModuleConfig {
  path: string;
  router: Router;
  isPublic?: boolean;
}

export const buildModules = (): ModuleConfig[] => {
  const authRouter = createAuthRouter();
  const issueRouter = createIssueRouter();
  const taskRouter = createTaskRouter();
  const jobRouter = createJobRouter();

  return [
    { path: ENDPOINTS.AUTH.PREFIX, router: authRouter, isPublic: true },
    { path: ENDPOINTS.ISSUE.PREFIX, router: issueRouter },
    { path: ENDPOINTS.TASK.PREFIX, router: taskRouter },
    { path: ENDPOINTS.JOB.PREFIX, router: jobRouter },
  ];
};
