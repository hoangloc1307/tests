import type { DocumentType } from 'shared/schemas/issue';
import { injectable, injectAll } from 'tsyringe';
import type { TaskDetailHandler } from '~/modules/task/domain/task-detail-handler';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

@injectable()
export class TaskDetailHandlerRegistry {
  private readonly handlers: Map<DocumentType, TaskDetailHandler>;

  constructor(@injectAll(TOKENS.TaskDetailHandler) handlers: TaskDetailHandler[]) {
    this.handlers = new Map(handlers.map((handler) => [handler.documentType, handler]));
  }

  resolve(documentType: DocumentType): TaskDetailHandler | undefined {
    return this.handlers.get(documentType);
  }
}
