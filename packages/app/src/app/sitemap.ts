import { MetadataRoute } from 'next';

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
    {
      url: `${SITE_URL}/${locale}/dashboard`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]);

  // TODO: Add dynamic wedding site pages here when we have a database
  // const weddingSites = await getAllPublishedSites();
  // const dynamicPages = weddingSites.map((site) => ({
  //   url: `https://${site.subdomain}.wdng.online`,
  //   lastModified: site.updatedAt,
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.6,
  // }));

  return [...staticPages, ...localizedPages];
}
