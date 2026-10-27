import { format, isValid } from 'date-fns';
import type { DocumentStatus } from 'shared/schemas/issue';
import type { TaskDetail, TaskDetailBase } from 'shared/types/task';
import { inject, injectable } from 'tsyringe';
import { TaskDetailHandlerRegistry } from '~/modules/task/application/handlers/task-detail-handler.registry';
import type { TaskRepository } from '~/modules/task/domain/task.repository';
import type { FlowableClient } from '~/shared/application/flowable/flowable-client';
import { extractRejectReason } from '~/shared/application/flowable/flowable-task';
import { AppError } from '~/shared/domain/app-error';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

@injectable()
export class GetTaskDetailUseCase {
  constructor(
    @inject(TOKENS.FlowableClient) private readonly flowableClient: FlowableClient,
    @inject(TOKENS.TaskRepository) private readonly taskRepository: TaskRepository,
    private readonly handlerRegistry: TaskDetailHandlerRegistry,
  ) {}

  async execute(documentId: string, taskId: string): Promise<TaskDetail> {
    // 1. Lấy thông tin chung của phiếu để biết loại phiếu (documentType).
    const master = await this.taskRepository.findDocumentMasterById(documentId);
    if (!master) {
      throw AppError.notFound('common:error.notFound');
    }

    // 2. Resolve handler theo loại phiếu; chưa hỗ trợ -> báo lỗi rõ ràng.
    const handler = this.handlerRegistry.resolve(master.documentType);
    if (!handler) {
      throw AppError.badRequest('common:error.unsupportedDocumentType', {
        documentType: master.documentType,
      });
    }

    // 3. Lấy phần chi tiết riêng theo loại phiếu.
    const part = await handler.getDetail(documentId);
    if (!part) {
      throw AppError.notFound('common:error.notFound');
    }

    // 4. Lấy task trên Flowable để biết lí do trả về (nếu có).
    const task = await this.flowableClient.getTask(taskId);

    // 5. Ghép phần base (dùng chung) với phần chi tiết riêng.
    const base: TaskDetailBase = {
      taskId: task.id,
      documentId: master.documentId,
      documentNo: master.documentNo,
      status: master.status as DocumentStatus,
      issuingSection: master.issueSection,
      receivingSection: master.receiveSection,
      issuingDate: isValid(master.issueDate) ? format(master.issueDate, 'yyyyMMdd') : null,
      createdBy: master.createdBy,
      createdDate: isValid(master.createdAt) ? format(master.createdAt, 'yyyyMMddHHmmss') : null,
      rejectReason: extractRejectReason(task),
    };

    return { ...base, ...part };
  }
}
