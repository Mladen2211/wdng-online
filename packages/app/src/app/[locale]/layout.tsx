// Force dynamic rendering for pages that use Clerk authentication
export const dynamic = 'force-dynamic';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  return (
    <div data-locale={locale}>
      {children}
    </div>
  );
}

// Note: generateStaticParams removed to allow dynamic rendering with Clerk
