import { randomUUID } from 'crypto';
import { inject, injectable } from 'tsyringe';
import type { Issue } from '~/modules/issue/domain/issue.entity';
import type { CreateIssueData, IssueRepository } from '~/modules/issue/domain/issue.repository';
import { TOKENS } from '~/shared/infrastructure/di/tokens';
import type { PrismaClientA5 } from '~/shared/infrastructure/prisma-a5';

@injectable()
export class PrismaIssueRepository implements IssueRepository {
  constructor(@inject(TOKENS.PrismaClientA5) private readonly prisma: PrismaClientA5) {}

  async create(data: CreateIssueData): Promise<Issue> {
    const { issueSection, issueDate, ...a5Data } = data;
    const documentId = randomUUID();

    const a5Document = await this.prisma.a5Document.create({
      data: {
        ...a5Data,
        detectedAt: new Date(),
        documentMaster: {
          create: {
            documentId,
            documentNo: a5Data.documentNo,
            documentType: 'A5',
            issueSection,
            issueDate,
          },
        },
      },
      include: {
        documentMaster: true,
      },
    });

    return {
      documentId: a5Document.documentId,
      documentNo: a5Document.documentNo,
      issueSection: a5Document.documentMaster.issueSection!,
      issueCategory: a5Document.issueCategory as Issue['issueCategory'],
      itemCategory: a5Document.itemCategory as Issue['itemCategory'],
      lineNo: a5Document.lineNo,
      jobOrderNo: a5Document.jobOrderNo,
      machineNo: a5Document.machineNo,
      lotNo: a5Document.lotNo,
      batchNo: a5Document.batchNo,
      itemCode: a5Document.itemCode,
      rubber: a5Document.rubber,
      glue: a5Document.glue,
      detectionStage: a5Document.detectionStage,
      detectionContent: a5Document.detectionContent,
      otherError: a5Document.otherError,
      detectedBy: a5Document.detectedBy,
      detectedQuantity: a5Document.detectedQuantity,
      abnormalArea: a5Document.abnormalArea as Issue['abnormalArea'],
      issueDate: a5Document.documentMaster.issueDate!,
      normalDescription: a5Document.normalDescription,
      abnormalDescription: a5Document.abnormalDescription,
      checkedBy: a5Document.checkedBy,
      abnormalLevel: a5Document.abnormalLevel,
      firstDetection: a5Document.firstDetection,
      recurrenceCount: a5Document.recurrenceCount,
      isA4Required: a5Document.isA4Required,
      ngQtyAfterHandling: a5Document.ngQtyAfterHandling,
      okQtyAfterHandling: a5Document.okQtyAfterHandling,
      amsDocumentNo: a5Document.amsDocumentNo,
    };
  }
}
