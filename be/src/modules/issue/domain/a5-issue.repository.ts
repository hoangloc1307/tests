import type { A5Detail, DocumentMaster } from '~/modules/issue/domain/issue.entity';
import type { PrismaClientA5 } from '~/shared/infrastructure/prisma-a5';

export type A5TxClient = Parameters<Parameters<PrismaClientA5['$transaction']>[0]>[0];

type OptionalFields =
  | 'jobOrderNo'
  | 'otherError'
  | 'checkedBy'
  | 'abnormalLevel'
  | 'firstDetection'
  | 'recurrenceCount'
  | 'isA4Required'
  | 'ngQtyAfterHandling'
  | 'okQtyAfterHandling'
  | 'amsDocumentNo'
  | 'otherAbnormalContent'
  | 'batchQty'
  | 'lotQty'
  | 'needCheckingQty'
  | 'qtyChecked'
  | 'controlOfBeginning'
  | 'attachSample'
  | 'ngEmp';

type MasterInputFields =
  | 'documentNo'
  | 'documentType'
  | 'issueSection'
  | 'issueDate'
  | 'processMasterId'
  | 'processInstanceId';

export type CreateA5IssueData = Omit<A5Detail, OptionalFields> &
  Partial<Pick<A5Detail, OptionalFields>> &
  Pick<DocumentMaster, MasterInputFields> & {
    createdBy: string;
  };

export interface A5IssueRepository {
  create(data: CreateA5IssueData, tx?: A5TxClient): Promise<DocumentMaster>;
}
