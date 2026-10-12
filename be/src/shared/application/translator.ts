export interface Translator {
  t(key: string, options?: Record<string, unknown>): string;
}
