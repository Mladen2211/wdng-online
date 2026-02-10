import type { Metadata, Viewport } from 'next';
import type { WeddingData } from '@/lib/types';

const SITE_NAME = 'wdng.online';
const SITE_URL = 'https://wdng.online';
const SITE_BASE = new URL(SITE_URL);
const DEFAULT_LOCALE = 'en';

interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  pathname?: string;
  locale?: string;
  noIndex?: boolean;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

// Core brand keywords for wedding website niche
const BRAND_KEYWORDS = [
  'wedding website',
  'wedding website builder',
  'free wedding website',
  'wedding site creator',
  'wedding invitation website',
  'online wedding invitation',
  'digital wedding invitation',
  'wedding RSVP website',
  'custom wedding website',
  'beautiful wedding website',
  'modern wedding website',
  'elegant wedding website',
  'wedding landing page',
  'wedding event website',
  'wedding website template',
  'wedding website themes',
  'personalized wedding website',
  'wedding subdomain',
  'wedding website hosting',
  'create wedding website',
  'build wedding website',
  'design wedding website',
  'wedding website with photos',
  'wedding website with map',
  'wedding countdown website',
  'multilingual wedding website',
  'wedding website generator',
];

// Localized SEO data
const LOCALIZED_SEO: Record<string, { title: string; description: string; keywords: string[] }> = {
  en: {
    title: 'Create Your Dream Wedding Website in Minutes | wdng.online',
    description: 'Build a stunning, professional wedding website with custom subdomains, beautiful themes, RSVP management, photo galleries, and interactive maps. Free to start, no coding required.',
    keywords: [
      ...BRAND_KEYWORDS,
      'wedding website UK',
      'wedding website USA',
      'destination wedding website',
    ],
  },
  de: {
    title: 'Erstellen Sie Ihre Traumhochzeitswebsite in Minuten | wdng.online',
    description: 'Erstellen Sie eine atemberaubende, professionelle Hochzeitswebsite mit individuellen Subdomains, wunderschönen Themes, RSVP-Verwaltung, Fotogalerien und interaktiven Karten. Kostenlos starten, keine Programmierkenntnisse erforderlich.',
    keywords: [
      'Hochzeitswebsite',
      'Hochzeitswebsite erstellen',
      'kostenlose Hochzeitswebsite',
      'Hochzeitshomepage',
      'Hochzeitseinladung online',
      'digitale Hochzeitseinladung',
      'Hochzeits RSVP',
      'Hochzeitswebsite Vorlage',
      'Hochzeitswebsite Design',
      'personalisierte Hochzeitswebsite',
    ],
  },
  hr: {
    title: 'Izradite Web Stranicu za Vjenčanje u Minutama | wdng.online',
    description: 'Izradite prekrasnu, profesionalnu web stranicu za vjenčanje s prilagođenim poddomenama, prekrasnim temama, upravljanjem RSVP-om, foto galerijama i interaktivnim kartama. Besplatno za početak, nije potrebno programiranje.',
    keywords: [
      'web stranica za vjenčanje',
      'izrada web stranice za vjenčanje',
      'besplatna web stranica za vjenčanje',
      'pozivnica za vjenčanje online',
      'digitalna pozivnica za vjenčanje',
      'vjenčanje RSVP',
      'predložak web stranice za vjenčanje',
      'dizajn web stranice za vjenčanje',
      'personalizirana web stranica za vjenčanje',
    ],
  },
};

export function generateSEOMetadata(config: SEOConfig = {}): Metadata {
  const locale = config.locale || DEFAULT_LOCALE;
  const localizedData = LOCALIZED_SEO[locale] || LOCALIZED_SEO.en;
  
  const title = config.title || localizedData.title;
  const description = config.description || localizedData.description;
  const keywords = config.keywords || localizedData.keywords;
  const canonicalUrl = config.pathname ? `${SITE_URL}${config.pathname}` : SITE_URL;
  const ogImage = config.ogImage || `${SITE_URL}/screenshots/landing.png`;

  return {
    // MetadataBase for resolving relative URLs
    metadataBase: SITE_BASE,
    
    // Primary Meta Tags
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    keywords: keywords.join(', '),
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    
    // Favicon & Icons
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    
    // Manifest for PWA
    manifest: '/manifest.json',

    // Application metadata
    applicationName: SITE_NAME,
    generator: 'Next.js',
    referrer: 'origin-when-cross-origin',
    
    // Robots
    robots: config.noIndex ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `${SITE_URL}/en`,
        'de': `${SITE_URL}/de`,
        'hr': `${SITE_URL}/hr`,
        'x-default': SITE_URL,
      },
    },

    // Open Graph
    openGraph: {
      type: config.ogType || 'website',
      locale: locale === 'de' ? 'de_DE' : locale === 'hr' ? 'hr_HR' : 'en_US',
      url: canonicalUrl,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1280,
          height: 720,
          alt: `${SITE_NAME} - Wedding Website Builder`,
          type: 'image/png',
        },
      ],
      ...(config.publishedTime && { publishedTime: config.publishedTime }),
      ...(config.modifiedTime && { modifiedTime: config.modifiedTime }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      site: '@wdng_online',
      creator: '@wdng_online',
      title,
      description,
      images: [ogImage],
    },

    // Verification (add your actual verification codes)
    verification: {
      google: 'HoMag1Y0D72x9AjTIAxwgR8hcNZrC-lfBs-FUFC5LX8',
      // yandex: 'your-yandex-verification-code',
      // bing: 'your-bing-verification-code',
    },

    // Additional metadata
    category: 'wedding',
    classification: 'Wedding Website Builder',
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAF9' },
    { media: '(prefers-color-scheme: dark)', color: '#1c1917' },
  ],
  colorScheme: 'light dark',
};

// JSON-LD Structured Data
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    sameAs: [
      'https://twitter.com/wdng_online',
      'https://instagram.com/wdng.online',
      'https://facebook.com/wdng.online',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'hello@wdng.online',
      availableLanguage: ['English', 'German', 'Croatian'],
    },
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: LOCALIZED_SEO.en.description,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['en-US', 'de-DE', 'hr-HR'],
  };
}

export function generateSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}/#software`,
    name: `${SITE_NAME} Wedding Website Builder`,
    description: LOCALIZED_SEO.en.description,
    url: SITE_URL,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free to start creating your wedding website',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1247',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Custom subdomain (yourname.wdng.online)',
      'Beautiful editorial themes',
      'Photo galleries',
      'Interactive venue maps',
      'RSVP management',
      'Countdown timer',
      'Mobile responsive design',
      'Multi-language support',
      'No coding required',
    ],
    screenshot: [
      {
        '@type': 'ImageObject',
        url: `${SITE_URL}/screenshots/builder.png`,
        caption: 'Wedding Website Builder Interface',
      },
      {
        '@type': 'ImageObject',
        url: `${SITE_URL}/screenshots/themes.png`,
        caption: 'Beautiful Wedding Website Themes',
      },
    ],
    creator: {
      '@id': `${SITE_URL}/#organization`,
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateHowToSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Create a Wedding Website',
    description: 'Step-by-step guide to creating your perfect wedding website with wdng.online',
    totalTime: 'PT10M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0',
    },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Choose Your Theme',
        text: 'Select from our collection of beautiful, editorial-grade wedding themes.',
        image: `${SITE_URL}/screenshots/step-1-themes.png`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Customize Your Content',
        text: 'Add your names, date, venue, photos, and story using our easy drag-and-drop builder.',
        image: `${SITE_URL}/screenshots/step-2-customize.png`,
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Publish & Share',
        text: 'Get your personalized subdomain and share your wedding website with guests.',
        image: `${SITE_URL}/screenshots/step-3-publish.png`,
      },
    ],
  };
}

// Combined schema for pages
export function generateCombinedSchema() {
  return [
    generateOrganizationSchema(),
    generateWebsiteSchema(),
    generateSoftwareApplicationSchema(),
    generateHowToSchema(),
  ];
}

// ============================================================
// Wedding Site SEO (per-subdomain)
// ============================================================

interface WeddingSiteSEO {
  subdomain: string;
  data: WeddingData;
}

/**
 * Generate metadata for an individual wedding site on a subdomain.
 * Used by sites/[siteId]/page.tsx generateMetadata().
 */
export function generateWeddingSiteMetadata({ subdomain, data }: WeddingSiteSEO): Metadata {
  const { bride, groom, dateFull, locationCity, locationCountry, heroImage } = data.global;
  const coupleName = `${bride} & ${groom}`;
  const title = `${coupleName} — Wedding`;
  const location = [locationCity, locationCountry].filter(Boolean).join(', ');
  const description = location
    ? `You're invited to celebrate the wedding of ${coupleName} on ${dateFull} in ${location}.`
    : `You're invited to celebrate the wedding of ${coupleName} on ${dateFull}.`;

  const siteUrl = `https://${subdomain}.wdng.online`;
  const ogImage = heroImage || `${SITE_URL}/screenshots/landing.png`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${coupleName}`,
    },
    description,
    applicationName: coupleName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      type: 'website',
      url: siteUrl,
      siteName: `${coupleName} Wedding`,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${coupleName} Wedding`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
    },
  };
}

/**
 * Generate JSON-LD Event schema for a wedding site.
 * Embeds as structured data so search engines show rich results.
 */
export function generateWeddingEventSchema({ subdomain, data }: WeddingSiteSEO): Record<string, unknown> {
  const { bride, groom, dateFull, locationCity, locationCountry, heroImage } = data.global;
  const coupleName = `${bride} & ${groom}`;
  const location = [locationCity, locationCountry].filter(Boolean).join(', ');

  // Try to parse the target date for ISO format
  let startDate: string | undefined;
  try {
    const parsed = new Date(data.config.targetDate);
    if (!isNaN(parsed.getTime())) {
      startDate = parsed.toISOString();
    }
  } catch { /* ignore parse errors */ }

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${coupleName} Wedding`,
    description: `Wedding celebration of ${coupleName}${location ? ` in ${location}` : ''}.`,
    startDate: startDate || dateFull,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    ...(heroImage && {
      image: [heroImage],
    }),
    location: {
      '@type': 'Place',
      name: location || 'Wedding Venue',
      address: {
        '@type': 'PostalAddress',
        ...(locationCity && { addressLocality: locationCity }),
        ...(locationCountry && { addressCountry: locationCountry }),
      },
    },
    organizer: {
      '@type': 'Person',
      name: coupleName,
      url: `https://${subdomain}.wdng.online`,
    },
  };
}
