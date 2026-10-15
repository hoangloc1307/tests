import { z } from 'zod';

export const createIssueSchema = z.object({
  issueCode: z.string(),
  issueSection: z.string().nonempty({ message: 'issue:validation.section_required' }),
  recorder: z.string(),
  issueDate: z.string().nonempty({ message: 'issue:validation.issue_date_required' }),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
