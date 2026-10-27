import { DOCUMENT_STATUS, type DocumentType } from 'shared/schemas/issue';
import { inject, injectable } from 'tsyringe';
import type {
  DocumentMasterInfo,
  TaskRepository,
  TaskStep,
  WipDocument,
} from '~/modules/task/domain/task.repository';
import { TOKENS } from '~/shared/infrastructure/di/tokens';
import type { PrismaClientA5 } from '~/shared/infrastructure/prisma-a5';

@injectable()
export class PrismaA5TaskRepository implements TaskRepository {
  constructor(@inject(TOKENS.PrismaClientA5) private readonly prisma: PrismaClientA5) {}

  async findWipDocumentsByProcessInstanceIds(processInstanceIds: string[]): Promise<WipDocument[]> {
    if (processInstanceIds.length === 0) return [];

    const rows = await this.prisma.documentMaster.findMany({
      where: {
        processInstanceId: { in: processInstanceIds },
        status: DOCUMENT_STATUS.WIP,
      },
      select: {
        processInstanceId: true,
        documentId: true,
        documentNo: true,
        documentType: true,
        issueSection: true,
        receiveSection: true,
        issueDate: true,
        createdBy: true,
        createdAt: true,
      },
    });

    return rows.map((row) => ({
      processInstanceId: row.processInstanceId,
      documentId: row.documentId,
      documentNo: row.documentNo,
      documentType: row.documentType as DocumentType,
      issueSection: row.issueSection,
      receiveSection: row.receiveSection,
      issueDate: row.issueDate,
      createdBy: row.createdBy,
      createdAt: row.createdAt,
    }));
  }

  async findActiveStepsByFlowableNames(flowableNames: string[]): Promise<TaskStep[]> {
    if (flowableNames.length === 0) return [];

    const rows = await this.prisma.stepMaster.findMany({
      where: {
        stepKey: { in: flowableNames },
        isActive: true,
      },
      select: {
        name: true,
        stepKey: true,
      },
    });

    return rows
      .filter((row): row is { stepKey: string; name: string } => Boolean(row.stepKey))
      .map((row) => ({
        stepKey: row.stepKey,
        name: row.name,
      }));
  }

  async findDocumentMasterById(documentId: string): Promise<DocumentMasterInfo | null> {
    const row = await this.prisma.documentMaster.findUnique({
      where: { documentId },
      select: {
        processInstanceId: true,
        documentId: true,
        documentNo: true,
        documentType: true,
        status: true,
        issueSection: true,
        receiveSection: true,
        issueDate: true,
        createdBy: true,
        createdAt: true,
      },
    });

    if (!row) return null;

    return {
      processInstanceId: row.processInstanceId,
      documentId: row.documentId,
      documentNo: row.documentNo,
      documentType: row.documentType as DocumentType,
      status: row.status,
      issueSection: row.issueSection,
      receiveSection: row.receiveSection,
      issueDate: row.issueDate,
      createdBy: row.createdBy,
      createdAt: row.createdAt,
    };
  }
}
