import type { AbnormalArea, IssueCategory, ItemCategory } from 'shared/schemas/issue';
import { DOCUMENT_TYPE } from 'shared/schemas/issue';
import { inject, injectable } from 'tsyringe';
import type {
  A5DocumentDetail,
  A5TaskDetailRepository,
} from '~/modules/task/domain/a5-task-detail.repository';
import type { TaskDetailHandler, TaskDetailPart } from '~/modules/task/domain/task-detail-handler';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

@injectable()
export class A5TaskDetailHandler implements TaskDetailHandler {
  readonly documentType = DOCUMENT_TYPE.A5;

  constructor(
    @inject(TOKENS.A5TaskDetailRepository)
    private readonly a5DetailRepo: A5TaskDetailRepository,
  ) {}

  async getDetail(documentId: string): Promise<TaskDetailPart | null> {
    const detail = await this.a5DetailRepo.findDetailByDocumentId(documentId);
    if (!detail) return null;

    return {
      documentType: this.documentType,
      detail: this.toResponse(detail),
    };
  }

  /** Map chi tiết A5 từ DB sang shape trả về cho FE. */
  private toResponse(detail: A5DocumentDetail): TaskDetailPart['detail'] {
    return {
      issueCategory: detail.issueCategory as IssueCategory,
      itemCategory: detail.itemCategory as ItemCategory,
      lineNo: detail.lineNo,
      jobOrderNo: detail.jobOrderNo,
      machineNo: detail.machineNo,
      lotNo: detail.lotNo,
      batchNo: detail.batchNo,
      itemCode: detail.itemCode,
      rubber: detail.rubber,
      glue: detail.glue,
      detectionStage: detail.detectionStage,
      detectionContent: detail.detectionContent,
      otherError: detail.otherError,
      detectedBy: detail.detectedBy,
      detectedQuantity: detail.detectedQuantity,
      abnormalArea: detail.abnormalArea as AbnormalArea,
      normalDescription: detail.normalDescription,
      abnormalDescription: detail.abnormalDescription,
      checkedBy: detail.checkedBy,
      abnormalLevel: detail.abnormalLevel,
      firstDetection: detail.firstDetection,
      recurrenceCount: detail.recurrenceCount,
      isA4Required: detail.isA4Required,
      ngQtyAfterHandling: detail.ngQtyAfterHandling,
      okQtyAfterHandling: detail.okQtyAfterHandling,
      amsDocumentNo: detail.amsDocumentNo,
      otherAbnormalContent: detail.otherAbnormalContent,
      batchQty: detail.batchQty,
      lotQty: detail.lotQty,
      needCheckingQty: detail.needCheckingQty,
      qtyChecked: detail.qtyChecked,
      controlOfBeginning: detail.controlOfBeginning,
      attachSample: detail.attachSample,
      ngEmp: detail.ngEmp,
    };
  }
}
