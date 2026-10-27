import { inject, injectable } from 'tsyringe';
import type {
  A5DocumentDetail,
  A5TaskDetailRepository,
} from '~/modules/task/domain/a5-task-detail.repository';
import { TOKENS } from '~/shared/infrastructure/di/tokens';
import type { PrismaClientA5 } from '~/shared/infrastructure/prisma-a5';

@injectable()
export class PrismaA5TaskDetailRepository implements A5TaskDetailRepository {
  constructor(@inject(TOKENS.PrismaClientA5) private readonly prisma: PrismaClientA5) {}

  async findDetailByDocumentId(documentId: string): Promise<A5DocumentDetail | null> {
    const a5 = await this.prisma.a5Document.findUnique({
      where: { documentId },
    });

    if (!a5) return null;

    return {
      issueCategory: a5.issueCategory,
      itemCategory: a5.itemCategory,
      lineNo: a5.lineNo,
      jobOrderNo: a5.jobOrderNo,
      machineNo: a5.machineNo,
      lotNo: a5.lotNo,
      batchNo: a5.batchNo,
      itemCode: a5.itemCode,
      rubber: a5.rubber,
      glue: a5.glue,
      detectionStage: a5.detectionStage,
      detectionContent: a5.detectionContent,
      otherError: a5.otherError,
      detectedBy: a5.detectedBy,
      detectedQuantity: a5.detectedQuantity,
      abnormalArea: a5.abnormalArea,
      detectedAt: a5.detectedAt,
      normalDescription: a5.normalDescription,
      abnormalDescription: a5.abnormalDescription,
      checkedBy: a5.checkedBy,
      abnormalLevel: a5.abnormalLevel,
      firstDetection: a5.firstDetection,
      recurrenceCount: a5.recurrenceCount,
      isA4Required: a5.isA4Required,
      ngQtyAfterHandling: a5.ngQtyAfterHandling,
      okQtyAfterHandling: a5.okQtyAfterHandling,
      amsDocumentNo: a5.amsDocumentNo,
      otherAbnormalContent: a5.otherAbnormalContent,
      batchQty: a5.batchQty,
      lotQty: a5.lotQty,
      needCheckingQty: a5.needCheckingQty,
      qtyChecked: a5.qtyChecked,
      controlOfBeginning: a5.controlOfBeginning,
      attachSample: a5.attachSample,
      ngEmp: a5.ngEmp,
    };
  }
}
