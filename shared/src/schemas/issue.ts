import { z } from 'zod';

export const DOCUMENT_TYPE = {
  A5: 'A5',
} as const;

export type DocumentType = (typeof DOCUMENT_TYPE)[keyof typeof DOCUMENT_TYPE];

/** Trạng thái phiếu (DocumentMaster.status). Phiếu mới tạo mặc định là WIP. */
export const DOCUMENT_STATUS = {
  CANCELLED: '0',
  WIP: '1',
  COMPLETED: '2',
} as const;

export type DocumentStatus = (typeof DOCUMENT_STATUS)[keyof typeof DOCUMENT_STATUS];

export const DocumentTypeEnum = z.enum(Object.values(DOCUMENT_TYPE) as [string, ...string[]], {
  message: 'issue:validation.document_type_required',
});

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

/**
 * Các field dùng chung cho mọi loại phiếu (lưu ở DocumentMaster).
 */
const baseIssueShape = {
  issueSection: z.string().nonempty({ message: 'issue:validation.section_required' }),
  issueDate: z
    .string()
    .nonempty({ message: 'issue:validation.issue_date_required' })
    .regex(/^\d{8}$/, { message: 'issue:validation.issue_date_invalid' }),
};

/**
 * Schema tạo phiếu A5 (gồm field chung + field chi tiết của A5).
 */
export const createA5IssueSchema = z.object({
  documentType: z.literal(DOCUMENT_TYPE.A5),
  ...baseIssueShape,
  issueCategory: IssueCategoryEnum,
  itemCategory: ItemCategoryEnum,
  itemCode: z.string().nonempty({ message: 'issue:validation.product_code_required' }),
  lotNo: z.string().nonempty({ message: 'issue:validation.lot_no_required' }),
  lineNo: z.string().nonempty({ message: 'issue:validation.line_required' }),
  machineNo: z.string().nonempty({ message: 'issue:validation.machine_required' }),
  glue: z.string().nonempty({ message: 'issue:validation.glue_required' }),
  rubber: z.string().nonempty({ message: 'issue:validation.rubber_required' }),
  batchNo: z.string().nonempty({ message: 'issue:validation.batch_required' }),
  detectedQuantity: z.coerce.number({ message: 'issue:validation.quantity_required' }),
  jobOrderNo: z.string(),
  detectionStage: z.string().nonempty({ message: 'issue:validation.detection_process_required' }),
  detectionContent: z.string().nonempty({ message: 'issue:validation.error_name_required' }),
  abnormalArea: AbnormalAreaEnum,
  normalDescription: z.string().nonempty({ message: 'issue:validation.normal_condition_required' }),
  abnormalDescription: z
    .string()
    .nonempty({ message: 'issue:validation.abnormal_condition_required' }),
  detectedBy: z.string(),
});

export type CreateA5IssueInput = z.infer<typeof createA5IssueSchema>;

/**
 * Discriminated union theo documentType. Thêm loại phiếu mới bằng cách
 * khai báo schema tương ứng rồi bổ sung vào union này.
 */
export const createIssueSchema = z.discriminatedUnion('documentType', [createA5IssueSchema]);

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
