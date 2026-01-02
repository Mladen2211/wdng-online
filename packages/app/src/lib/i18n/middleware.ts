import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale, isValidLocale } from '@/lib/i18n/config';

export function i18nMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip for API routes, static files, and site preview routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/sites') ||
    pathname.includes('.') ||
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-out')
  ) {
    return NextResponse.next();
  }

  // Check if path already has a valid locale
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) {
    return NextResponse.next();
  }

  // Redirect to default locale
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  
  return NextResponse.redirect(url);
}
