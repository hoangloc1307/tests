import { isValid, parse } from 'date-fns';
import { DOCUMENT_TYPE, type CreateIssueInput } from 'shared/schemas/issue';
import { inject, injectable } from 'tsyringe';
import type { A5IssueRepository } from '~/modules/issue/domain/a5-issue.repository';
import type { DocumentHandler } from '~/modules/issue/domain/document-handler';
import { DocumentMaster } from '~/modules/issue/domain/issue.entity';
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
  ) {}

  async create(input: CreateIssueInput, username: string): Promise<DocumentMaster> {
    if (input.documentType !== DOCUMENT_TYPE.A5) {
      throw AppError.server('common:error.handlerDocumentTypeMismatch', {
        expected: this.documentType,
        received: input.documentType,
      });
    }

    const { issueDate, ...rest } = input;

    const parsedIssueDate = parse(issueDate, 'yyyyMMdd', new Date());
    if (!isValid(parsedIssueDate)) {
      throw AppError.validation('common:error.invalidIssueDate', { issueDate });
    }

    //  Tìm process master phiên bản mới nhất đang dùng của loại phiếu A5
    const processMaster = await this.a5IssueRepo.findLatestProcessMaster(this.documentType);

    if (!processMaster) {
      throw AppError.server('common:error.processNotFound', {
        documentType: this.documentType,
      });
    }

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

        return this.a5IssueRepo.create(
          {
            ...rest,
            documentNo,
            issueDate: parsedIssueDate,
            createdBy: username,
            processMasterId: processMaster.id,
            processInstanceId: processInstance.id,
          },
          a5Tx,
        );
      });
    } catch (err) {
      await this.flowableClient
        .deleteProcessInstance(processInstance.id, 'Tạo phiếu A5 thất bại, huỷ instance')
        .catch(() => undefined);
      throw err;
    }
  }
}
