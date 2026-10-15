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
