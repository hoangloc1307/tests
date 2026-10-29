import { parse } from 'date-fns';

/**
 * Parse chuỗi ngày `yyyyMMdd` sang Date .
 * Chỉ gọi ở tầng infrastructure lúc insert; giá trị đã được zod validate là ngày có thật.
 */
export const parseYmd = (value: string): Date => parse(value, 'yyyyMMdd', new Date());
