import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { hrQueries } from '~/hooks/queries/hr.queries';

/**
 * Hook dùng chung cho dữ liệu bộ phận (section) từ master HR.
 * Cung cấp map mã -> tên và các helper hiển thị, tránh lặp lại
 * việc build map + format "mã - tên" ở nhiều trang.
 */
export function useSections() {
  const { data: sections = [] } = useQuery(hrQueries.sections());

  const sectionNameById = useMemo(
    () => new Map(sections.map((s) => [s.SectionId, s.Name])),
    [sections],
  );

  /** Options cho Select/Combobox chọn bộ phận, label dạng "mã - tên". */
  const sectionOptions = useMemo(
    () => sections.map((s) => ({ value: s.SectionId, label: `${s.SectionId} - ${s.Name}` })),
    [sections],
  );

  /** Lấy tên bộ phận theo mã; trả về undefined nếu không có trong master. */
  const getSectionName = (sectionId: string | null | undefined): string | undefined => {
    if (!sectionId) return undefined;
    return sectionNameById.get(sectionId);
  };

  /**
   * Hiển thị bộ phận dạng "mã - tên"; fallback về mã nếu chưa có tên trong master.
   * Trả về null nếu không có mã (để caller tự quyết placeholder).
   */
  const getSectionLabel = (sectionId: string | null | undefined): string | null => {
    if (!sectionId) return null;
    const name = sectionNameById.get(sectionId);
    return name ? `${sectionId} - ${name}` : sectionId;
  };

  return { sections, sectionOptions, sectionNameById, getSectionName, getSectionLabel };
}
