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

/**
 * Thông tin chung (master) của một phiếu — không phụ thuộc loại phiếu.
 * Dùng để usecase dựng phần base và biết documentType nào để resolve handler.
 */
export interface DocumentMasterInfo {
  processInstanceId: string;
  documentId: string;
  documentNo: string;
  documentType: DocumentType;
  status: string;
  issueSection: string;
  receiveSection: string | null;
  issueDate: Date;
  createdBy: string;
  createdAt: Date;
}

export interface TaskRepository {
  findWipDocumentsByProcessInstanceIds(processInstanceIds: string[]): Promise<WipDocument[]>;
  findActiveStepsByFlowableNames(flowableNames: string[]): Promise<TaskStep[]>;
  findDocumentMasterById(documentId: string): Promise<DocumentMasterInfo | null>;
}
