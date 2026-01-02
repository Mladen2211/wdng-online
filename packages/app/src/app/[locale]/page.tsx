import LandingPage from '@/components/LandingPage';
import { Locale, isValidLocale, defaultLocale } from '@/lib/i18n/config';

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : defaultLocale;
  
  return <LandingPage locale={locale} />;
}
