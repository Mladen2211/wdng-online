import WeddingSite from '@/components/WeddingSite';

interface SitePageProps {
  params: Promise<{
    siteId: string;
  }>;
}

export default async function SitePage({ params }: SitePageProps) {
  const { siteId } = await params;
  return <WeddingSite siteId={siteId} />;
}