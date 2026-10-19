import type { Issue } from '~/modules/issue/domain/issue.entity';

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
  | 'amsDocumentNo';

export type CreateIssueData = Omit<Issue, 'documentId' | OptionalFields> &
  Partial<Pick<Issue, OptionalFields>>;

export interface IssueRepository {
  create(data: CreateIssueData): Promise<Issue>;
}
