import { isValidYmd } from 'shared/utils/date';
import { z } from 'zod';

/** Loại phiếu */
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

/**
 * Validate `documentType` thuộc một trong các giá trị của `DOCUMENT_TYPE`.
 * Dùng khi nhận loại phiếu dạng tham số tự do (vd: query `?documentType=A5` để lọc danh sách).
 * Schema tạo phiếu KHÔNG dùng enum này — mỗi loại phiếu tự khai `z.literal(...)` làm
 * discriminator cho `createIssueSchema`.
 */
export const DocumentTypeEnum = z.enum(Object.values(DOCUMENT_TYPE) as [string, ...string[]], {
  message: 'issue:validation.document_type_required',
});

/**
 * Các field dùng chung cho mọi loại phiếu (lưu ở DocumentMaster).
 * Schema của từng loại phiếu spread shape này vào.
 */
export const baseIssueShape = {
  /** Bộ phận phát hành */
  issueSection: z
    .string()
    .nonempty({ message: 'issue:validation.section_required' })
    .max(4, { message: 'issue:validation.section_too_long' }),

  /** Ngày phát hành (yyyyMMdd, phải là ngày có thật). Giữ chuỗi tới lúc insert mới parse Date. */
  issueDate: z
    .string()
    // abort: rỗng thì dừng, không báo thêm lỗi "không hợp lệ".
    .nonempty({ message: 'issue:validation.issue_date_required', abort: true })
    // isValidYmd kiểm tra cả định dạng 8 chữ số lẫn ngày có thật.
    .refine(isValidYmd, { message: 'issue:validation.issue_date_invalid' }),
};
