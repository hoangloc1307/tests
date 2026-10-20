import { Router } from 'express';
import { ENDPOINTS } from 'shared/constants/endpoints';
import { createIssueSchema } from 'shared/schemas/issue';
import { IssueController } from '~/modules/issue/presentation/issue.controller';
import { container } from '~/shared/infrastructure/di/container';
import { bodyParser, fileValidator, requestValidator } from '~/shared/presentation/middlewares';

export const createIssueRouter = (): Router => {
  const controller = container.resolve(IssueController);
  const router = Router();

  router.post(
    ENDPOINTS.ISSUE.CREATE,
    // 1. parse: files -> req.files, JSON (field `data`) -> req.body
    bodyParser(),
    // 2. validate files only (text fields are validated by the zod schema below)
    fileValidator([
      {
        field: 'attachments',
        type: 'file',
        required: false,
        maxCount: 10,
        maxSize: 10 * 1024 * 1024,
      },
    ]),
    // 3. validate the JSON payload
    requestValidator(createIssueSchema),
    controller.create,
  );

  return router;
};
