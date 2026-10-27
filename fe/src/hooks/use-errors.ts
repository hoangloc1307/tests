import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ErrorConfig } from '~/apis/master';
import { masterQueries } from '~/hooks/queries/master.queries';

/** Lấy tên lỗi theo ngôn ngữ hiện tại (fallback về tiếng Việt). */
const pickErrorName = (error: ErrorConfig, lang: string): string => {
  if (lang === 'en') return error.NameEN;
  if (lang === 'ja') return error.NameJP;
  return error.NameVI;
};

/**
 * Hook dùng chung cho dữ liệu tên lỗi (error config) theo một công đoạn.
 * Cung cấp map code -> tên theo ngôn ngữ và options cho Select/Combobox.
 * Truyền processId rỗng khi chưa chọn công đoạn (query sẽ tự tắt).
 */
export function useErrors(processId: string | null | undefined) {
  const { i18n } = useTranslation();
  const { data: errors = [] } = useQuery(masterQueries.errorsByProcess(processId ?? ''));

  const lang = i18n.language;

  const errorNameByCode = useMemo(
    () => new Map(errors.map((e) => [e.ErrorCode, pickErrorName(e, lang)])),
    [errors, lang],
  );

  /** Options cho Select/Combobox chọn lỗi: value là code, hiển thị chỉ tên. */
  const errorOptions = useMemo(
    () => errors.map((e) => ({ value: e.ErrorCode, label: pickErrorName(e, lang) })),
    [errors, lang],
  );

  /** Lấy tên lỗi theo code; trả về undefined nếu không có trong master. */
  const getErrorName = (errorCode: string | null | undefined): string | undefined => {
    if (!errorCode) return undefined;
    return errorNameByCode.get(errorCode);
  };

  /**
   * Hiển thị lỗi dạng "code - tên"; fallback về code nếu chưa có tên trong master.
   * Trả về null nếu không có code (để caller tự quyết placeholder).
   */
  const getErrorLabel = (errorCode: string | null | undefined): string | null => {
    if (!errorCode) return null;
    const name = errorNameByCode.get(errorCode);
    return name ? `${errorCode} - ${name}` : errorCode;
  };

  return { errors, errorOptions, errorNameByCode, getErrorName, getErrorLabel };
}
