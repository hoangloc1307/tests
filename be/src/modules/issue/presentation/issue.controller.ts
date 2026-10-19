import type { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateIssueUseCase } from '~/modules/issue/application/create-issue.usecase';
import { ApiResponse } from '~/shared/presentation/api-response';

@injectable()
export class IssueController {
  constructor(private readonly createIssueUseCase: CreateIssueUseCase) {}

  create = async (req: Request, res: Response) => {
    const issue = await this.createIssueUseCase.execute(req.body);
    ApiResponse.created(res, issue);
  };
}
