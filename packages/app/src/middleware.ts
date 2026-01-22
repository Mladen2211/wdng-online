import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n/config';

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Extract the subdomain
  const subdomain = hostname.split('.')[0];

  // If it's a subdomain (user wedding sites), rewrite to sites route
  if (subdomain && subdomain !== 'www' && subdomain !== 'localhost' && hostname.includes('.wdng.online')) {
    return NextResponse.rewrite(new URL(`/sites/${subdomain}${pathname}`, request.url));
  }

  // Skip i18n handling for API routes, static files, and site preview routes
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

  // If no locale in path, redirect to default locale
  if (!pathnameLocale) {
    // Rewrite root to default locale to support Google Verification (avoids redirect)
    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/${defaultLocale}`, request.url));
    }

    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  // If it's the root domain
  if (hostname === 'wdng.online' || hostname.startsWith('localhost')) {
    // If path starts with /app, serve the builder
    if (pathname.startsWith('/app')) {
      return NextResponse.rewrite(new URL('/builder' + pathname.replace('/app', ''), request.url));
    }
  }

  // All routes are public - auth is handled via modal dialogs in components
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};