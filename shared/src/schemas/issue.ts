import { z } from 'zod';

export const IssueCategoryEnum = z.enum(['SAFETY', 'QUALITY', '2S', 'EQUIPMENT'], {
  message: 'issue:validation.category_required',
});
export type IssueCategory = z.infer<typeof IssueCategoryEnum>;

export const ItemCategoryEnum = z.enum(['PRODUCT', 'METAL_CASE', 'SPRING', 'RUBBER', 'OTHER'], {
  message: 'issue:validation.detection_type_required',
});
export type ItemCategory = z.infer<typeof ItemCategoryEnum>;

export const AbnormalAreaEnum = z.enum(['A', "A'", 'B', 'C', 'D', 'E', 'OTHER'], {
  message: 'issue:validation.anomaly_location_required',
});
export type AbnormalArea = z.infer<typeof AbnormalAreaEnum>;

export const createIssueSchema = z.object({
  documentNo: z.string(),
  issueSection: z.string().nonempty({ message: 'issue:validation.section_required' }),
  issueCategory: IssueCategoryEnum,
  itemCategory: ItemCategoryEnum,
  itemCode: z.string().nonempty({ message: 'issue:validation.product_code_required' }),
  lotNo: z.string().nonempty({ message: 'issue:validation.lot_no_required' }),
  lineNo: z.string().nonempty({ message: 'issue:validation.line_required' }),
  machineNo: z.string().nonempty({ message: 'issue:validation.machine_required' }),
  glue: z.string().nonempty({ message: 'issue:validation.glue_required' }),
  rubber: z.string().nonempty({ message: 'issue:validation.rubber_required' }),
  batchNo: z.string().nonempty({ message: 'issue:validation.batch_required' }),
  detectedQuantity: z.number({ message: 'issue:validation.quantity_required' }),
  jobOrderNo: z.string(),
  detectionStage: z.string().nonempty({ message: 'issue:validation.detection_process_required' }),
  detectionContent: z.string().nonempty({ message: 'issue:validation.error_name_required' }),
  abnormalArea: AbnormalAreaEnum,
  normalDescription: z.string().nonempty({ message: 'issue:validation.normal_condition_required' }),
  abnormalDescription: z
    .string()
    .nonempty({ message: 'issue:validation.abnormal_condition_required' }),
  detectedBy: z.string(),
  issueDate: z.string().nonempty({ message: 'issue:validation.issue_date_required' }),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
