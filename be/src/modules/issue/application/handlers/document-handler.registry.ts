import type { DocumentType } from 'shared/schemas/issue';
import { injectable, injectAll } from 'tsyringe';
import type { DocumentHandler } from '~/modules/issue/domain/document-handler';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

@injectable()
export class DocumentHandlerRegistry {
  private readonly handlers: Map<DocumentType, DocumentHandler>;

  constructor(@injectAll(TOKENS.DocumentHandler) handlers: DocumentHandler[]) {
    this.handlers = new Map(handlers.map((handler) => [handler.documentType, handler]));
  }

  resolve(documentType: DocumentType): DocumentHandler | undefined {
    return this.handlers.get(documentType);
  }
}
