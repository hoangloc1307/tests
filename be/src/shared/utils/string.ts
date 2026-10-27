/**
 * Chuẩn hoá chuỗi: trim khoảng trắng hai đầu, trả về '' nếu null/undefined.
 */
export const normalizeString = (value: string | null | undefined): string => value?.trim() ?? '';
