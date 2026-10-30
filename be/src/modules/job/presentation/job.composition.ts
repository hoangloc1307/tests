import { Router } from 'express';
import { ENDPOINTS } from 'shared/constants/endpoints';
import { JobController } from '~/modules/job/presentation/job.controller';
import { container } from '~/shared/infrastructure/di/container';

export const createJobRouter = (): Router => {
  const controller = container.resolve(JobController);
  const router = Router();

  router.get(ENDPOINTS.JOB.HOLDING_LIST, controller.holdingList);
  router.get(ENDPOINTS.JOB.DETAIL, controller.detail);

  return router;
};
