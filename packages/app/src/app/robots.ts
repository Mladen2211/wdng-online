import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = 'https://wdng.online';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/*/dashboard/',
          '/builder/',
          '/*/builder/',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/*/dashboard/',
          '/builder/',
          '/*/builder/',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/*/dashboard/',
          '/builder/',
          '/*/builder/',
        ],
      },
    ],
    sitemap: [
      `${siteUrl}/sitemap.xml`,
    ],
    host: siteUrl,
  };
}
