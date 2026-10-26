import type { DocumentType } from 'shared/schemas/issue';

export interface WipDocument {
  processInstanceId: string;
  documentId: string;
  documentNo: string;
  documentType: DocumentType;
  issueSection: string;
  receiveSection: string | null;
  issueDate: Date;
  createdBy: string;
  createdAt: Date;
}

export interface TaskStep {
  stepKey: string;
  name: string;
}

export interface TaskRepository {
  findWipDocumentsByProcessInstanceIds(processInstanceIds: string[]): Promise<WipDocument[]>;
  findActiveStepsByFlowableNames(flowableNames: string[]): Promise<TaskStep[]>;
}
