import type { Translator } from '~/shared/application/translator';
import i18next from '~/shared/infrastructure/i18n/i18next';

export class I18nextTranslator implements Translator {
  t(key: string, options?: Record<string, unknown>): string {
    return i18next.t(key, options);
  }
}
