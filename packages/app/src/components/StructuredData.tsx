import { generateCombinedSchema } from '@/lib/seo';

interface StructuredDataProps {
  schemas?: Record<string, unknown>[];
}

export function StructuredData({ schemas }: StructuredDataProps) {
  const allSchemas = schemas || generateCombinedSchema();

  return (
    <>
      {allSchemas.map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}

export default StructuredData;
