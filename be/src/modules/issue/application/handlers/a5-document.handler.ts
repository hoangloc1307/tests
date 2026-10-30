import { DOCUMENT_TYPE } from 'shared/schemas/issue';
import { ABNORMAL_LEVEL } from 'shared/schemas/issue/a5';
import type { CreateIssueInput } from 'shared/schemas/issue/create-issue';
import { inject, injectable } from 'tsyringe';
import type { A5IssueRepository } from '~/modules/issue/domain/a5-issue.repository';
import type { DocumentHandler } from '~/modules/issue/domain/document-handler';
import { DocumentMaster } from '~/modules/issue/domain/issue.entity';
import type { JobHoldRepository } from '~/modules/issue/domain/job-hold.repository';
import type { FlowableClient } from '~/shared/application/flowable/flowable-client';
import { FLOWABLE_VARIABLE_NAME } from '~/shared/application/flowable/flowable-constants';
import type { SerialGenerator } from '~/shared/application/serial-generator';
import { AppError } from '~/shared/domain/app-error';
import { TOKENS } from '~/shared/infrastructure/di/tokens';
import { prismaA5 } from '~/shared/infrastructure/prisma-a5';

@injectable()
export class A5DocumentHandler implements DocumentHandler {
  readonly documentType = DOCUMENT_TYPE.A5;

  constructor(
    @inject(TOKENS.A5IssueRepository) private readonly a5IssueRepo: A5IssueRepository,
    @inject(TOKENS.SerialGenerator) private readonly serialGenerator: SerialGenerator,
    @inject(TOKENS.FlowableClient) private readonly flowableClient: FlowableClient,
    @inject(TOKENS.JobHoldRepository) private readonly jobHoldRepo: JobHoldRepository,
  ) {}

  async create(input: CreateIssueInput, username: string): Promise<DocumentMaster> {
    if (input.documentType !== DOCUMENT_TYPE.A5) {
      throw AppError.server('common:error.handlerDocumentTypeMismatch', {
        expected: this.documentType,
        received: input.documentType,
      });
    }

    //  Tìm process master phiên bản mới nhất đang dùng của loại phiếu A5
    const processMaster = await this.a5IssueRepo.findLatestProcessMaster(this.documentType);

    if (!processMaster)
      throw AppError.server('common:error.processNotFound', { documentType: this.documentType });

    // Tạo process instance
    const variables = [
      { name: FLOWABLE_VARIABLE_NAME.SECTION_CREATED, value: input.issueSection },
      { name: FLOWABLE_VARIABLE_NAME.ISSUER, value: username },
      { name: FLOWABLE_VARIABLE_NAME.DOCUMENT_TYPE, value: this.documentType },
    ];

    const processInstance = await this.flowableClient.startProcessInstance({
      processDefinitionId: processMaster.processDefinitionId,
      name: this.documentType,
      variables,
    });

    // Lưu dữ liệu vào database, nếu thất bại thì xoá process instance
    try {
      return await prismaA5.$transaction(async (a5Tx) => {
        const documentNo = await this.serialGenerator.generate(
          { serialCode: this.documentType },
          a5Tx,
        );

        const document = await this.a5IssueRepo.create(
          {
            ...input,
            documentNo,
            createdBy: username,
            processMasterId: processMaster.id,
            processInstanceId: processInstance.id,
          },
          a5Tx,
        );

        const jobOrderNo = input.jobOrderNo.trim();
        if (jobOrderNo && input.abnormalLevel >= ABNORMAL_LEVEL.MAJOR) {
          await this.jobHoldRepo.hold({
            jobOrderNo,
            documentNo: document.documentNo,
            abnormalLevel: input.abnormalLevel,
          });
        }

        return document;
      });
    } catch (err) {
      await this.flowableClient
        .deleteProcessInstance(processInstance.id, 'Tạo phiếu A5 thất bại, huỷ instance')
        .catch(() => undefined);
      throw err;
    }
  }
}
