import Impressum from '@/components/landing/Impressum';
import { Navbar } from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { getTranslations } from '@/lib/i18n/translations';
import { Locale } from '@/lib/i18n/config';

export default async function ImpressumPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations(locale);

  return (
    <div className="min-h-screen bg-white">
      <Navbar locale={locale} translations={t} scrolled={true} />
      <div className="pt-20">
        <Impressum />
      </div>
      <Footer locale={locale} translations={t} />
    </div>
  );
}
