import { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Wedding Website Builder - Create Your Site',
  description: 'Use our intuitive drag-and-drop builder to create your perfect wedding website. Choose themes, add photos, include venue maps, and more.',
  pathname: '/builder',
  noIndex: true, // Builder pages should not be indexed
});

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
