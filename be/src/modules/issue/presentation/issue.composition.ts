import { Router } from 'express';
import { ACTIONS } from 'shared/constants/actions';
import { ENDPOINTS } from 'shared/constants/endpoints';
import { FEATURES } from 'shared/constants/features';
import { createA5IssueSchema } from 'shared/schemas/issue/a5';
import { authorize } from '~/modules/auth/presentation/middlewares/authorize';
import { IssueController } from '~/modules/issue/presentation/issue.controller';
import { container } from '~/shared/infrastructure/di/container';
import { bodyParser, requestValidator } from '~/shared/presentation/middlewares';

export const createIssueRouter = (): Router => {
  const controller = container.resolve(IssueController);
  const router = Router();

  // Phiếu A5: quyền tạo gắn cố định với feature ISSUE_A5.
  router.post(
    ENDPOINTS.ISSUE.CREATE_A5,
    authorize(FEATURES.ISSUE_A5, ACTIONS.CREATE),
    bodyParser(),
    requestValidator(createA5IssueSchema),
    controller.createA5,
  );

  return router;
};
