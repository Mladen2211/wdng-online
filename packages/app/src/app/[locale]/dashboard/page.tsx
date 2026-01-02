'use client';

import Dashboard from '@/components/Dashboard';
import { useLocale } from '@/lib/i18n/useTranslations';

export default function DashboardPage() {
  const locale = useLocale();
  return <Dashboard locale={locale} />;
}
