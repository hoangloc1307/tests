import { format, isValid, parse } from 'date-fns';

export { cn } from 'cn';

/**
 * Build full URL from prefix and route, replacing params
 * @example buildUrl('/users', '/:id', { id: 123 }) => '/users/123'
 */
export function buildUrl<T extends Record<string, string | number>>(
  prefix: string,
  route: string,
  params?: T,
): string {
  const fullPath = `${prefix}${route}`;
  if (!params) return fullPath;

  return fullPath.replace(/:(\w+)/g, (_, key) => String(params[key] ?? `:${key}`));
}

/**
 * Format a compact `yyyyMMdd` date string into `dd/MM/yyyy`.
 * Returns `null` for empty/invalid input.
 * @example formatCompactDate('20261026') => '26/10/2026'
 */
export function formatCompactDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = parse(value, 'yyyyMMdd', new Date());
  return isValid(parsed) ? format(parsed, 'dd/MM/yyyy') : null;
}

/**
 * Format a compact `yyyyMMddHHmmss` datetime string into `dd/MM/yyyy HH:mm:ss`.
 * Returns `null` for empty/invalid input.
 * @example formatCompactDateTime('20261026143005') => '26/10/2026 14:30:05'
 */
export function formatCompactDateTime(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = parse(value, 'yyyyMMddHHmmss', new Date());
  return isValid(parsed) ? format(parsed, 'dd/MM/yyyy HH:mm:ss') : null;
}
