import { z } from 'zod';

export const IssueCategoryEnum = z.enum(['SAFETY', 'QUALITY', '2S', 'EQUIPMENT'], {
  message: 'issue:validation.category_required',
});
export type IssueCategory = z.infer<typeof IssueCategoryEnum>;

export const DetectionTypeEnum = z.enum(['PRODUCT', 'METAL_CASE', 'SPRING', 'RUBBER', 'OTHER'], {
  message: 'issue:validation.detection_type_required',
});
export type DetectionType = z.infer<typeof DetectionTypeEnum>;

export const AnomalyLocationEnum = z.enum(['A', "A'", 'B', 'C', 'D', 'E', 'OTHER'], {
  message: 'issue:validation.anomaly_location_required',
});
export type AnomalyLocation = z.infer<typeof AnomalyLocationEnum>;

export const createIssueSchema = z.object({
  issueCode: z.string(),
  issueSection: z.string().nonempty({ message: 'issue:validation.section_required' }),
  category: IssueCategoryEnum,
  detectionType: DetectionTypeEnum,
  productCode: z.string().nonempty({ message: 'issue:validation.product_code_required' }),
  lotNo: z.string().nonempty({ message: 'issue:validation.lot_no_required' }),
  line: z.string().nonempty({ message: 'issue:validation.line_required' }),
  machine: z.string().nonempty({ message: 'issue:validation.machine_required' }),
  glue: z.string().nonempty({ message: 'issue:validation.glue_required' }),
  rubber: z.string().nonempty({ message: 'issue:validation.rubber_required' }),
  batch: z.string().nonempty({ message: 'issue:validation.batch_required' }),
  quantity: z.number({ message: 'issue:validation.quantity_required' }),
  jobNo: z.string(),
  detectionProcess: z.string().nonempty({ message: 'issue:validation.detection_process_required' }),
  errorCode: z.string().nonempty({ message: 'issue:validation.error_name_required' }),
  anomalyLocation: AnomalyLocationEnum,
  normalCondition: z.string().nonempty({ message: 'issue:validation.normal_condition_required' }),
  abnormalCondition: z
    .string()
    .nonempty({ message: 'issue:validation.abnormal_condition_required' }),
  recorder: z.string(),
  issueDate: z.string().nonempty({ message: 'issue:validation.issue_date_required' }),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
