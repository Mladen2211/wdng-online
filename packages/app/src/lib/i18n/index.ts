// Re-export all i18n utilities for convenience
export { locales, defaultLocale, localeNames, isValidLocale, type Locale } from './config';
export { getTranslations, t, type TranslationKeys } from './translations';
export { useLocale, useTranslations, useT } from './useTranslations';
