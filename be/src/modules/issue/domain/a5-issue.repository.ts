import type { DocumentType } from 'shared/schemas/issue';
import type { CreateA5IssueInput } from 'shared/schemas/issue/a5';
import type { DocumentMaster, ProcessMaster } from '~/modules/issue/domain/issue.entity';
import type { PrismaClientA5 } from '~/shared/infrastructure/prisma-a5';

export type A5TxClient = Parameters<Parameters<PrismaClientA5['$transaction']>[0]>[0];

export type CreateA5IssueData = CreateA5IssueInput &
  Pick<DocumentMaster, 'documentNo' | 'processMasterId' | 'processInstanceId'> & {
    createdBy: string;
  };

export interface A5IssueRepository {
  create(data: CreateA5IssueData, tx?: A5TxClient): Promise<DocumentMaster>;
  findLatestProcessMaster(documentType: DocumentType): Promise<ProcessMaster | null>;
}
