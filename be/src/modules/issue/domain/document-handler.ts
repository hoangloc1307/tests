import type { CreateIssueInput, DocumentType } from 'shared/schemas/issue';
import type { DocumentMaster } from '~/modules/issue/domain/issue.entity';

export interface DocumentHandler {
  readonly documentType: DocumentType;

  create(input: CreateIssueInput, username: string): Promise<DocumentMaster>;
}
