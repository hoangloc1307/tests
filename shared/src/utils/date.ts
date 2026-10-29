/**
 * Kiểm tra chuỗi `yyyyMMdd` là một ngày có thật (vd: loại `20261399`, `20260230`).
 * Tạo Date theo giờ địa phương rồi so lại từng thành phần — tràn ngày/tháng sẽ lệch.
 */
export const isValidYmd = (value: string): boolean => {
  if (!/^\d{8}$/.test(value)) return false;

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};
