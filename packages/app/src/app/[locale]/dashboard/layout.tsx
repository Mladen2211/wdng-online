import { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Dashboard - Manage Your Wedding Websites',
  description: 'Manage all your wedding websites from one place. Edit, preview, and share your beautiful wedding sites with guests.',
  pathname: '/dashboard',
  noIndex: true, // Dashboard pages should not be indexed
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
