import type { DocumentType } from 'shared/schemas/issue';

export interface TaskListItem {
  taskId: string;
  documentId: string;
  documentNo: string;
  documentType: DocumentType;
  issuingSection: string;
  receivingSection: string | null;
  issuingDate: string | null;
  currentStep: string | null;
  createdBy: string;
  createdDate: string | null;
  rejectReason: string | null;
}
