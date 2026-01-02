'use client';

import { useParams } from 'next/navigation';
import { Locale, defaultLocale, isValidLocale } from './config';
import { getTranslations, TranslationKeys, t } from './translations';

export function useLocale(): Locale {
  const params = useParams();
  const locale = params?.locale as string | undefined;
  
  if (locale && isValidLocale(locale)) {
    return locale;
  }
  
  return defaultLocale;
}

export function useTranslations(): TranslationKeys {
  const locale = useLocale();
  return getTranslations(locale);
}

export function useT() {
  const locale = useLocale();
  return (path: string) => t(locale, path);
}
