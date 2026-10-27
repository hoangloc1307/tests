import type { CreateIssueInput } from 'shared/schemas/issue';
import { inject, injectable } from 'tsyringe';
import { DocumentHandlerRegistry } from '~/modules/issue/application/handlers/document-handler.registry';
import { flowableApproval } from '~/shared/application/flowable/flowable-task';
import type { FlowableClient } from '~/shared/application/flowable/flowable-client';
import {
  FLOWABLE_VARIABLE_NAME,
  FLOWABLE_VARIABLE_SCOPE,
} from '~/shared/application/flowable/flowable-constants';
import { AppError } from '~/shared/domain/app-error';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

@injectable()
export class CreateIssueUseCase {
  constructor(
    private readonly handlerRegistry: DocumentHandlerRegistry,
    @inject(TOKENS.FlowableClient) private readonly flowableClient: FlowableClient,
  ) {}

  async execute(input: CreateIssueInput, username: string): Promise<string> {
    const handler = this.handlerRegistry.resolve(input.documentType);
    if (!handler) {
      throw AppError.badRequest('common:error.unsupportedDocumentType', {
        documentType: input.documentType,
      });
    }

    // Tạo phiếu đặc thù theo từng loại documentType (gồm sinh mã + start Flowable).
    const master = await handler.create(input, username);

    // Tìm task đầu tiên (task tạo phiếu) để hoàn thành
    const tasks = await this.flowableClient.listTasks(master.processInstanceId);
    const task = tasks.data.at(0);

    if (task) {
      await flowableApproval(this.flowableClient, {
        taskId: task.id,
        completedBy: username,
        variables: [
          {
            name: FLOWABLE_VARIABLE_NAME.DOCUMENT_NO,
            value: master.documentNo,
            scope: FLOWABLE_VARIABLE_SCOPE.GLOBAL,
          },
        ],
      });
    }

    return master.documentNo;
  }
}
