import type { Request, Response } from 'express';
import type { CreateIssueInput } from 'shared/schemas/issue';
import { injectable } from 'tsyringe';
import { CreateIssueUseCase } from '~/modules/issue/application/create-issue.usecase';
import { ApiResponse } from '~/shared/presentation/api-response';

@injectable()
export class IssueController {
  constructor(private readonly createIssueUseCase: CreateIssueUseCase) {}

  create = async (req: Request, res: Response) => {
    const username = req.user?.username as string;
    const input = req.validatedData?.body as CreateIssueInput;

    const documentNo = await this.createIssueUseCase.execute(input, username);
    ApiResponse.created(res, { documentNo });
  };
}
