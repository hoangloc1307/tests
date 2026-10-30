/**
 * Kiểm tra giá trị là chuỗi có nội dung (không rỗng, không chỉ toàn khoảng trắng).
 * Nhận `unknown` để dùng được trong refine cấp object có `when: () => true` —
 * lúc đó field có thể đang lỗi kiểu nên không chắc đã là chuỗi đã trim.
 */
export const isNonBlankString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim() !== '';
