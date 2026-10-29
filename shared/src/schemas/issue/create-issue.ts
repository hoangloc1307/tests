import { createA5IssueSchema } from 'shared/schemas/issue/a5';
import { z } from 'zod';

export const createIssueSchema = z.discriminatedUnion('documentType', [createA5IssueSchema]);

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
