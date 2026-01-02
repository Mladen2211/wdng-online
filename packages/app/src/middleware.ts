import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Extract the subdomain
  const subdomain = hostname.split('.')[0];

  // If it's a subdomain (user wedding sites), rewrite to sites route
  if (subdomain && subdomain !== 'www' && subdomain !== 'localhost' && hostname.includes('.wdng.online')) {
    return NextResponse.rewrite(new URL(`/sites/${subdomain}${pathname}`, request.url));
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