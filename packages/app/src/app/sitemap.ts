import { MetadataRoute } from 'next';
import { db } from '@wdng/db';

const SITE_URL = 'https://wdng.online';
const LOCALES = ['en', 'de', 'hr'];

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
  ];

  // Localized landing pages
  const localizedPages = LOCALES.flatMap((locale) => [
    {
      url: `${SITE_URL}/${locale}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/${locale}/builder`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]);

  // Legal pages
  const legalPages = LOCALES.flatMap((locale) => [
    {
      url: `${SITE_URL}/${locale}/legal/impressum`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/${locale}/legal/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/${locale}/terms/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]);

  // Published wedding sites on subdomains
  let weddingSitePages: MetadataRoute.Sitemap = [];
  try {
    const publishedSites = db.getPublishedSites();
    weddingSitePages = publishedSites.map((site) => ({
      url: `https://${site.subdomain}.wdng.online`,
      lastModified: site.updated_at,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching published sites for sitemap:', error);
  }

  return [...staticPages, ...localizedPages, ...legalPages, ...weddingSitePages];
}
