import type { DocumentStatus, DocumentType } from 'shared/schemas/issue';
import type { A5Detail } from 'shared/types/task';

export interface DocumentMaster {
  documentId: string;
  documentNo: string;
  documentType: DocumentType;
  processMasterId: string;
  processInstanceId: string;
  issueSection: string;
  issueDate: Date;
  receiveSection: string | null;
  finishDate: Date | null;
  cancelReason: string | null;
  status: DocumentStatus;
}

export type A5Issue = DocumentMaster & A5Detail;

export interface ProcessMaster {
  id: string;
  processDefinitionId: string;
}
