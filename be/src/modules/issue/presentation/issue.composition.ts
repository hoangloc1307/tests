import { Router } from 'express';
import { ENDPOINTS } from 'shared/constants/endpoints';
import { createIssueSchema } from 'shared/schemas/issue';
import { IssueController } from '~/modules/issue/presentation/issue.controller';
import { container } from '~/shared/infrastructure/di/container';
import { requestValidator } from '~/shared/presentation/middlewares';

export const createIssueRouter = (): Router => {
  const controller = container.resolve(IssueController);
  const router = Router();

  router.post(ENDPOINTS.ISSUE.CREATE, requestValidator(createIssueSchema), controller.create);

  return router;
};
