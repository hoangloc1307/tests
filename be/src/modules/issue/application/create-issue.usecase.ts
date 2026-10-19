import type { CreateIssueInput } from 'shared/schemas/issue';
import { inject, injectable } from 'tsyringe';
import type { Issue } from '~/modules/issue/domain/issue.entity';
import type { IssueRepository } from '~/modules/issue/domain/issue.repository';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

@injectable()
export class CreateIssueUseCase {
  constructor(@inject(TOKENS.IssueRepository) private readonly issueRepo: IssueRepository) {}

  async execute(input: CreateIssueInput): Promise<Issue> {
    return this.issueRepo.create({
      ...input,
      issueDate: new Date(input.issueDate),
    });
  }
}
