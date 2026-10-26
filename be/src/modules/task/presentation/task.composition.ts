import { Router } from 'express';
import { ENDPOINTS } from 'shared/constants/endpoints';
import { TaskController } from '~/modules/task/presentation/task.controller';
import { container } from '~/shared/infrastructure/di/container';

export const createTaskRouter = (): Router => {
  const controller = container.resolve(TaskController);
  const router = Router();

  router.get(ENDPOINTS.TASK.LIST, controller.list);

  return router;
};
