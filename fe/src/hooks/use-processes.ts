import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Process } from '~/apis/master';
import { masterQueries } from '~/hooks/queries/master.queries';

/** Lấy tên công đoạn theo ngôn ngữ hiện tại (fallback về tiếng Việt). */
const pickProcessName = (process: Process, lang: string): string => {
  if (lang === 'en') return process.OperationNameEn;
  if (lang === 'ja') return process.OperationNameJp;
  return process.OperationNameVI;
};

/**
 * Hook dùng chung cho dữ liệu công đoạn phát hiện (process master).
 * Cung cấp map id -> tên theo ngôn ngữ và options cho Select/Combobox,
 * tránh lặp lại việc build "id - tên" ở nhiều trang.
 */
export function useProcesses() {
  const { i18n } = useTranslation();
  const { data: processes = [] } = useQuery(masterQueries.processes());

  const lang = i18n.language;

  const processNameById = useMemo(
    () => new Map(processes.map((p) => [p.ProcessId, pickProcessName(p, lang)])),
    [processes, lang],
  );

  /** Options cho Select/Combobox chọn công đoạn: value là id, hiển thị chỉ tên. */
  const processOptions = useMemo(
    () => processes.map((p) => ({ value: p.ProcessId, label: pickProcessName(p, lang) })),
    [processes, lang],
  );

  /** Lấy tên công đoạn theo id; trả về undefined nếu không có trong master. */
  const getProcessName = (processId: string | null | undefined): string | undefined => {
    if (!processId) return undefined;
    return processNameById.get(processId);
  };

  /**
   * Hiển thị công đoạn dạng "id - tên"; fallback về id nếu chưa có tên trong master.
   * Trả về null nếu không có id (để caller tự quyết placeholder).
   */
  const getProcessLabel = (processId: string | null | undefined): string | null => {
    if (!processId) return null;
    const name = processNameById.get(processId);
    return name ? `${processId} - ${name}` : processId;
  };

  return { processes, processOptions, processNameById, getProcessName, getProcessLabel };
}
