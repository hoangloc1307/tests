/**
 * Translator port (Application layer).
 *
 * Use cases depend on this abstraction to produce localized messages. They have
 * no idea i18next exists — the concrete `I18nextTranslator` lives in
 * infrastructure and is injected via the composition root.
 */
export interface Translator {
  t(key: string, options?: Record<string, unknown>): string;
}
