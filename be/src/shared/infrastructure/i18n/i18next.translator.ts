import type { Translator } from '~/shared/application/translator';
import i18next from '~/shared/infrastructure/i18n/i18next';

/**
 * i18next adapter implementing the Translator port.
 *
 * Note: translation uses the language currently set on the shared i18next
 * instance (updated per-request by the languageDetector middleware).
 */
export class I18nextTranslator implements Translator {
  t(key: string, options?: Record<string, unknown>): string {
    return i18next.t(key, options);
  }
}
