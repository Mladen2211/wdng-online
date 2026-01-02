'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getTranslations } from '@/lib/i18n/translations';
import { defaultLocale } from '@/lib/i18n/config';
import {
  Navbar,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  ThemesSection,
  PricingSection,
  Footer,
  type LandingPageProps,
} from './landing';

const SCROLL_THRESHOLD = 50;

const LandingPage: React.FC<LandingPageProps> = ({ locale = defaultLocale }) => {
  const t = getTranslations(locale);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartBuilding = useCallback(() => {
    router.push(`/${locale}/builder`);
  }, [router, locale]);

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans text-stone-800 selection:bg-rose-200">
      <Navbar
        locale={locale}
        translations={t}
        scrolled={scrolled}
        onStartBuilding={handleStartBuilding}
      />

      <HeroSection 
        translations={t} 
        onStartBuilding={handleStartBuilding} 
      />

      <FeaturesSection translations={t} />

      <HowItWorksSection 
        translations={t} 
        onStartBuilding={handleStartBuilding} 
      />

      <ThemesSection translations={t} />

      <PricingSection 
        translations={t} 
        onStartBuilding={handleStartBuilding} 
      />

      <Footer locale={locale} translations={t} />
    </div>
  );
};

export default LandingPage;