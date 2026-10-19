import type { CreateIssueInput } from 'shared/schemas/issue';
import { inject, injectable } from 'tsyringe';
import type { Issue } from '~/modules/issue/domain/issue.entity';
import type { IssueRepository } from '~/modules/issue/domain/issue.repository';
import type { FlowableClient } from '~/shared/application/flowable-client';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

@injectable()
export class CreateIssueUseCase {
  constructor(
    @inject(TOKENS.IssueRepository) private readonly issueRepo: IssueRepository,
    @inject(TOKENS.FlowableClient) private readonly flowableClient: FlowableClient,
  ) {}

  async execute(input: CreateIssueInput): Promise<Issue> {
    const issue = await this.issueRepo.create({
      ...input,
      issueDate: new Date(input.issueDate),
    });

    await this.flowableClient.startProcessInstance({
      processDefinitionId: 'issue-approval',
      name: `Issue ${issue.documentNo}`,
      variables: [
        { name: 'issueId', value: issue.documentId },
        { name: 'issueSection', value: issue.issueSection },
        { name: 'issueCategory', value: issue.issueCategory },
        { name: 'detectedBy', value: issue.detectedBy },
      ],
    });

    return issue;
  }
}
