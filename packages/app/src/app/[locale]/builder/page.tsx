'use client';

import BuilderApp from '@/components/BuilderApp';
import { useLocale } from '@/lib/i18n/useTranslations';

export default function BuilderPage() {
  const locale = useLocale();
  return <BuilderApp locale={locale} />;
}
