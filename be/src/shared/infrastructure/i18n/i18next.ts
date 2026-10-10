import i18next from 'i18next';
import backend from 'i18next-fs-backend';
import path from 'path';

export const SUPPORTED_LANGUAGES = ['en', 'vi'];
export const DEFAULT_LANGUAGE = 'vi';

i18next.use(backend).init({
  initAsync: false,
  lng: 'vi',
  fallbackLng: 'vi',
  supportedLngs: SUPPORTED_LANGUAGES,
  ns: ['common', 'auth'],
  defaultNS: 'common',
  backend: {
    loadPath: path.join(import.meta.dirname, 'locales/{{lng}}/{{ns}}.json'),
  },
  interpolation: {
    escapeValue: false,
  },
});

export function changeLanguage(lng: string) {
  return i18next.changeLanguage(lng);
}

export default i18next;
