import type { A5TxClient } from '~/modules/issue/domain/a5-issue.repository';

export interface SerialTokenReplacement {
  key: string;
  value: string;
}

export interface GenerateDocumentNoParams {
  serialCode: string;
  createDate?: Date;
  additionalInfo?: SerialTokenReplacement[];
}

export interface SerialGenerator {
  generate(params: GenerateDocumentNoParams, tx?: A5TxClient): Promise<string>;
}
