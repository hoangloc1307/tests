import { baseIssueShape, DOCUMENT_TYPE } from 'shared/schemas/issue';
import { isValidYmd } from 'shared/utils/date';
import { isNonBlankString } from 'shared/utils/string';
import { z } from 'zod';

/** Phân loại (An toàn / Chất lượng / 2S / Thiết bị) */
export const IssueCategoryEnum = z.enum(['SAFETY', 'QUALITY', '2S', 'EQUIPMENT'], {
  message: 'issue:validation.category_required',
});
export type IssueCategory = z.infer<typeof IssueCategoryEnum>;

/** Phát hiện trên (Sản phẩm / Metal case / Lò xo / Cao su / Khác) */
export const ItemCategoryEnum = z.enum(['PRODUCT', 'METAL_CASE', 'SPRING', 'RUBBER', 'OTHER'], {
  message: 'issue:validation.detection_type_required',
});
export type ItemCategory = z.infer<typeof ItemCategoryEnum>;

/** Vị trí bất thường */
export const AbnormalAreaEnum = z.enum(['A', "A'", 'B', 'C', 'D', 'E', 'OTHER'], {
  message: 'issue:validation.anomaly_location_required',
});
export type AbnormalArea = z.infer<typeof AbnormalAreaEnum>;

/** Mức độ bất thường: 1 = Nhẹ, 2 = Nặng, 3 = Nghiêm trọng. */
export const ABNORMAL_LEVEL = {
  MINOR: 1,
  MAJOR: 2,
  CRITICAL: 3,
} as const;

/** Giá trị số thực của mức độ (lưu DB / trả response). */
export const AbnormalLevelEnum = z.union([z.literal(1), z.literal(2), z.literal(3)], {
  message: 'issue:validation.abnormal_level_invalid',
});
export type AbnormalLevel = z.infer<typeof AbnormalLevelEnum>;

/** Giá trị chuỗi dùng cho select/radio trên form (sẽ transform về số khi submit). */
export const AbnormalLevelValueEnum = z.enum(['1', '2', '3'], {
  message: 'issue:validation.abnormal_level_required',
});
export type AbnormalLevelValue = z.infer<typeof AbnormalLevelValueEnum>;

/**
 * Schema tạo phiếu A5 (gồm field chung + field chi tiết của A5).
 */
export const createA5IssueSchema = z
  .object({
    ...baseIssueShape,

    /** Loại phiếu A5 */
    documentType: z.literal(DOCUMENT_TYPE.A5),

    /** Phân loại (An toàn / Chất lượng / 2S / Thiết bị) */
    issueCategory: IssueCategoryEnum,

    /** Phát hiện trên (Sản phẩm / Metal case / Lò xo / Cao su / Khác) */
    itemCategory: ItemCategoryEnum,

    /** Mã sản phẩm */
    itemCode: z
      .string()
      .trim()
      .nonempty({ message: 'issue:validation.product_code_required' })
      .max(30, { message: 'issue:validation.product_code_too_long' }),

    /** Lot no */
    lotNo: z
      .string()
      .trim()
      .nonempty({ message: 'issue:validation.lot_no_required' })
      .max(6, { message: 'issue:validation.lot_no_too_long' }),

    /** Line */
    lineNo: z
      .string()
      .trim()
      .nonempty({ message: 'issue:validation.line_required' })
      .max(10, { message: 'issue:validation.line_too_long' }),

    /** Máy */
    machineNo: z
      .string()
      .trim()
      .nonempty({ message: 'issue:validation.machine_required' })
      .max(10, { message: 'issue:validation.machine_too_long' }),

    /** Keo */
    glue: z
      .string()
      .trim()
      .nonempty({ message: 'issue:validation.glue_required' })
      .max(10, { message: 'issue:validation.glue_too_long' }),

    /** Cao su */
    rubber: z
      .string()
      .trim()
      .nonempty({ message: 'issue:validation.rubber_required' })
      .max(10, { message: 'issue:validation.rubber_too_long' }),

    /** Batch */
    batchNo: z
      .string()
      .trim()
      .nonempty({ message: 'issue:validation.batch_required' })
      .max(10, { message: 'issue:validation.batch_too_long' }),

    /** Số lượng phát hiện (số nguyên > 0) */
    detectedQuantity: z
      .number({ message: 'issue:validation.quantity_required' })
      .int({ message: 'issue:validation.quantity_positive' })
      .positive({ message: 'issue:validation.quantity_positive' })
      .nullable()
      .refine((v): v is number => v !== null, { message: 'issue:validation.quantity_required' }),

    /** Job no (không bắt buộc) */
    jobOrderNo: z.string().trim().max(12, { message: 'issue:validation.job_no_too_long' }),

    /** Công đoạn phát hiện */
    detectionStage: z
      .string()
      .trim()
      .nonempty({ message: 'issue:validation.detection_process_required' })
      .max(30, { message: 'issue:validation.detection_process_too_long' }),

    /** Tên lỗi (id lỗi) */
    detectionContent: z
      .string()
      .trim()
      .nonempty({ message: 'issue:validation.error_name_required' })
      .max(10, { message: 'issue:validation.error_name_too_long' }),

    /** Vị trí bất thường */
    abnormalArea: AbnormalAreaEnum,

    /** Tình trạng bình thường */
    normalDescription: z
      .string()
      .trim()
      .nonempty({ message: 'issue:validation.normal_condition_required' })
      .max(250, { message: 'issue:validation.normal_condition_too_long' }),

    /** Tình trạng bất thường */
    abnormalDescription: z
      .string()
      .trim()
      .nonempty({ message: 'issue:validation.abnormal_condition_required' })
      .max(250, { message: 'issue:validation.abnormal_condition_too_long' }),

    /** Mã nhân viên phát hiện */
    detectedBy: z
      .string()
      .trim()
      .nonempty({ message: 'issue:validation.detector_required' })
      .max(8, { message: 'issue:validation.detector_too_long' }),

    /** Mã nhân viên kiểm tra */
    checkedBy: z
      .string()
      .trim()
      .nonempty({ message: 'issue:validation.checker_required' })
      .max(8, { message: 'issue:validation.checker_too_long' }),

    /** Mức độ (form gửi '1' | '2' | '3', transform về số 1 | 2 | 3) */
    abnormalLevel: AbnormalLevelValueEnum.transform((v) => Number(v) as AbnormalLevel),

    /** Ngày phát hiện (yyyyMMdd, phải là ngày có thật). Giữ chuỗi tới lúc insert mới parse Date. */
    detectedAt: z
      .string({ message: 'issue:validation.detected_date_required' })
      .trim()
      // abort: rỗng thì dừng, không báo thêm lỗi "không hợp lệ".
      .nonempty({ message: 'issue:validation.detected_date_required', abort: true })
      // isValidYmd kiểm tra cả định dạng 8 chữ số lẫn ngày có thật.
      .refine(isValidYmd, { message: 'issue:validation.detected_date_invalid' }),

    /** Phán định (true = OK / false = NG) */
    judgment: z.boolean({ message: 'issue:validation.judgment_required' }),

    /** Phát hành A4 (true = Có / false = Không) */
    isA4Required: z.boolean({ message: 'issue:validation.a4_required_required' }),

    /** Tần suất phát sinh (true = Lần đầu / false = Tái phát sinh) */
    firstDetection: z.boolean({ message: 'issue:validation.occurrence_frequency_required' }),

    /** Số lần tái phát sinh (bắt buộc khi chọn tái phát sinh — xem refine bên dưới, số nguyên > 0) */
    recurrenceCount: z
      .number()
      .int({ message: 'issue:validation.recurrence_count_invalid' })
      .positive({ message: 'issue:validation.recurrence_count_invalid' })
      .nullable(),

    /** Cần xử lý (true = Có / false = Không) */
    isHandlingRequired: z.boolean({ message: 'issue:validation.handling_required_required' }),

    /** Phạm vi xử lý (bắt buộc khi cần xử lý = Có — xem refine bên dưới) */
    handlingScope: z
      .string()
      .trim()
      .max(255, { message: 'issue:validation.handling_scope_too_long' }),

    /** Kết quả xử lý: số lượng NG (pcs, không bắt buộc, số nguyên >= 0) */
    ngQtyAfterHandling: z
      .number()
      .int({ message: 'issue:validation.handling_result_qty_invalid' })
      .nonnegative({ message: 'issue:validation.handling_result_qty_invalid' })
      .nullable(),

    /** Kết quả xử lý: số lượng OK (pcs, không bắt buộc, số nguyên >= 0) */
    okQtyAfterHandling: z
      .number()
      .int({ message: 'issue:validation.handling_result_qty_invalid' })
      .nonnegative({ message: 'issue:validation.handling_result_qty_invalid' })
      .nullable(),

    /** Hướng dẫn xử lý (bắt buộc khi cần xử lý = Có — xem refine bên dưới) */
    handlingInstruction: z
      .string()
      .trim()
      .max(500, { message: 'issue:validation.handling_instruction_too_long' }),
  })
  /** Chọn "Tái phát sinh" (firstDetection = false) thì bắt buộc nhập số lần tái phát sinh. */
  .refine((data) => data.firstDetection !== false || data.recurrenceCount != null, {
    path: ['recurrenceCount'],
    message: 'issue:validation.recurrence_count_required',
    // Luôn chạy, kể cả khi field khác còn lỗi, để lỗi này hiện cùng lúc với các lỗi còn lại.
    when: () => true,
  })
  /** Chọn "Cần xử lý" = Có thì bắt buộc nhập phạm vi xử lý. */
  .refine((data) => data.isHandlingRequired !== true || isNonBlankString(data.handlingScope), {
    path: ['handlingScope'],
    message: 'issue:validation.handling_scope_required',
    when: () => true,
  })
  /** Chọn "Cần xử lý" = Có thì bắt buộc nhập hướng dẫn xử lý. */
  .refine(
    (data) => data.isHandlingRequired !== true || isNonBlankString(data.handlingInstruction),
    {
      path: ['handlingInstruction'],
      message: 'issue:validation.handling_instruction_required',
      when: () => true,
    },
  );

/**
 * Dữ liệu FE gửi lên API (kiểu ĐẦU VÀO của schema, chưa transform — vd `abnormalLevel: '2'`).
 * FE chỉ validate rồi gửi nguyên giá trị; KHÔNG gửi kết quả `parse`, vì BE sẽ parse lại.
 */
export type CreateA5IssueRequest = z.input<typeof createA5IssueSchema>;

/**
 * Dữ liệu BE dùng sau khi `requestValidator` parse (kiểu ĐẦU RA — vd `abnormalLevel: 2`).
 */
export type CreateA5IssueInput = z.infer<typeof createA5IssueSchema>;
