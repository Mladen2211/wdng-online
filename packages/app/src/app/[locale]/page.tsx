import { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/seo';
import LandingPage from '@/components/LandingPage';
import { Locale, isValidLocale, defaultLocale } from '@/lib/i18n/config';

// Force dynamic rendering to avoid Clerk issues during build
export const dynamic = 'force-dynamic';

// Localized metadata for each language
const LOCALIZED_METADATA: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Create Your Dream Wedding Website in Minutes',
    description: 'Build a stunning, professional wedding website with custom subdomains, beautiful themes, RSVP management, photo galleries, and interactive maps. Free to start, no coding required.',
  },
  de: {
    title: 'Erstellen Sie Ihre Traumhochzeitswebsite in Minuten',
    description: 'Erstellen Sie eine atemberaubende, professionelle Hochzeitswebsite mit individuellen Subdomains, wunderschönen Themes, RSVP-Verwaltung, Fotogalerien und interaktiven Karten.',
  },
  hr: {
    title: 'Izradite Web Stranicu za Vjenčanje u Minutama',
    description: 'Izradite prekrasnu, profesionalnu web stranicu za vjenčanje s prilagođenim poddomenama, prekrasnim temama, upravljanjem RSVP-om, foto galerijama i interaktivnim kartama.',
  },
};

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : defaultLocale;
  const localizedData = LOCALIZED_METADATA[locale];

  return generateSEOMetadata({
    title: localizedData.title,
    description: localizedData.description,
    locale,
    pathname: `/${locale}`,
  });
}

export default async function LocaleHomePage({ params }: Props) {
  const { locale: localeParam } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : defaultLocale;

  return <LandingPage locale={locale} />;
}
