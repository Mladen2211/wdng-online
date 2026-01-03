'use client';

import Script from 'next/script';
import { generateCombinedSchema } from '@/lib/seo';

interface StructuredDataProps {
  schemas?: Record<string, unknown>[];
}

export function StructuredData({ schemas }: StructuredDataProps) {
  const allSchemas = schemas || generateCombinedSchema();

  return (
    <>
      {allSchemas.map((schema, index) => (
        <Script
          key={`schema-${index}`}
          id={`structured-data-${index}`}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}

export default StructuredData;
