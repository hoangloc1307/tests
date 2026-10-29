import type { Request, Response } from 'express';
import type { CreateIssueInput } from 'shared/schemas/issue/create-issue';
import { injectable } from 'tsyringe';
import { CreateIssueUseCase } from '~/modules/issue/application/create-issue.usecase';
import { AppError } from '~/shared/domain/app-error';
import { ApiResponse } from '~/shared/presentation/api-response';

@injectable()
export class IssueController {
  constructor(private readonly createIssueUseCase: CreateIssueUseCase) {}

  createA5 = async (req: Request, res: Response) => {
    const username = req.user?.username as string;
    const input = req.validatedData?.body as CreateIssueInput;
    const authContext = req.authContext;

    if (!authContext?.isSuperAdmin && !authContext?.sections.includes(input.issueSection)) {
      throw AppError.forbidden('common:error.sectionNotAllowed');
    }

    const documentNo = await this.createIssueUseCase.execute(input, username);
    ApiResponse.created(res, { documentNo });
  };
}
