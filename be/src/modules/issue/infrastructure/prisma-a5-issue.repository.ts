import { randomUUID } from 'crypto';
import { DOCUMENT_STATUS, type DocumentStatus, type DocumentType } from 'shared/schemas/issue';
import { inject, injectable } from 'tsyringe';
import type {
  A5IssueRepository,
  A5TxClient,
  CreateA5IssueData,
} from '~/modules/issue/domain/a5-issue.repository';
import type { DocumentMaster, ProcessMaster } from '~/modules/issue/domain/issue.entity';
import { TOKENS } from '~/shared/infrastructure/di/tokens';
import type { PrismaClientA5 } from '~/shared/infrastructure/prisma-a5';
import { parseYmd } from '~/shared/utils/date';

@injectable()
export class PrismaA5IssueRepository implements A5IssueRepository {
  constructor(@inject(TOKENS.PrismaClientA5) private readonly prisma: PrismaClientA5) {}

  async findLatestProcessMaster(documentType: DocumentType): Promise<ProcessMaster | null> {
    const processMaster = await this.prisma.processMaster.findFirst({
      where: {
        documentType,
        isLatestVersion: true,
        isActive: true,
      },
      select: {
        id: true,
        processDefinitionId: true,
      },
    });

    if (!processMaster?.processDefinitionId) return null;

    return {
      id: processMaster.id,
      processDefinitionId: processMaster.processDefinitionId,
    };
  }

  async create(data: CreateA5IssueData, tx?: A5TxClient): Promise<DocumentMaster> {
    const {
      documentNo,
      documentType,
      issueSection,
      issueDate,
      createdBy,
      processMasterId,
      processInstanceId,
      detectedAt,
      ...a5Detail
    } = data;
    const documentId = randomUUID();

    const db = tx ?? this.prisma;

    const a5Document = await db.a5Document.create({
      data: {
        ...a5Detail,
        detectedAt: parseYmd(detectedAt),
        documentMaster: {
          create: {
            documentId,
            documentNo,
            documentType,
            issueSection,
            issueDate: parseYmd(issueDate),
            status: DOCUMENT_STATUS.WIP,
            createdBy,
            processMasterId,
            processInstanceId,
          },
        },
      },
      include: {
        documentMaster: true,
      },
    });

    const master = a5Document.documentMaster;

    return {
      documentId: master.documentId,
      documentNo: master.documentNo,
      documentType: master.documentType as DocumentType,
      processMasterId: master.processMasterId,
      processInstanceId: master.processInstanceId,
      issueSection: master.issueSection,
      issueDate: master.issueDate,
      receiveSection: master.receiveSection,
      finishDate: master.finishDate,
      cancelReason: master.cancelReason,
      status: master.status as DocumentStatus,
    };
  }
}
