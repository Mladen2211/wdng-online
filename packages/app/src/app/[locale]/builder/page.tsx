'use client';

import { Suspense } from 'react';
import BuilderApp from '@/components/BuilderApp';
import { useLocale } from '@/lib/i18n/useTranslations';

export default function BuilderPage() {
  const locale = useLocale();
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-300 border-t-rose-600" /></div>}>
      <BuilderApp locale={locale} />
    </Suspense>
  );
}
