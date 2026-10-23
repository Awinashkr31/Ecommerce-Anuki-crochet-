import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import redirectsData from './lib/redirects-data.json';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const proto = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(':', '');
  
  // Enforce single 301 redirect to https://www.anukicrochet.in
  const isApex = host === 'anukicrochet.in';
  const isHttp = proto === 'http';

  if (isApex || (isHttp && (host === 'www.anukicrochet.in' || host === 'anukicrochet.in'))) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.host = 'www.anukicrochet.in';
    url.port = '';
    return NextResponse.redirect(url, 301);
  }

  const pathname = request.nextUrl.pathname;

  // Server-side redirect manager check
  const matchedRedirect = redirectsData.find(
    (r: any) => r.fromPath === pathname || decodeURIComponent(r.fromPath) === decodeURIComponent(pathname)
  );

  if (matchedRedirect && matchedRedirect.toPath !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = matchedRedirect.toPath;
    return NextResponse.redirect(url, matchedRedirect.statusCode || 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt, sw.js
     * - static media files (svg, png, jpg, jpeg, gif, webp, ico, woff, woff2)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
  ],
};
