import type { Metadata } from 'next';
import WeddingSite from '@/components/WeddingSite';
import { getSiteBySubdomain } from '@/actions/sites';
import { generateWeddingSiteMetadata, generateWeddingEventSchema } from '@/lib/seo';

interface SitePageProps {
  params: Promise<{
    siteId: string;
  }>;
}

export async function generateMetadata({ params }: SitePageProps): Promise<Metadata> {
  const { siteId } = await params;

  try {
    const result = await getSiteBySubdomain(siteId);
    if (result.success && result.data) {
      return generateWeddingSiteMetadata({
        subdomain: result.subdomain || siteId,
        data: result.data,
      });
    }
  } catch {
    // Fall through to defaults
  }

  return {
    title: 'Wedding Site',
    description: 'A beautiful wedding website powered by wdng.online',
  };
}

export default async function SitePage({ params }: SitePageProps) {
  const { siteId } = await params;

  // Pre-fetch data for structured data injection
  let structuredData: Record<string, unknown> | null = null;
  try {
    const result = await getSiteBySubdomain(siteId);
    if (result.success && result.data) {
      structuredData = generateWeddingEventSchema({
        subdomain: result.subdomain || siteId,
        data: result.data,
      });
    }
  } catch {
    // No structured data if fetch fails
  }

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <WeddingSite siteId={siteId} />
    </>
  );
}