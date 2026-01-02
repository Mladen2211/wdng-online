export const locales = ['en', 'de', 'hr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  hr: 'Hrvatski'
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
