import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware protects routes under /manage and /create.
export function middleware(request: NextRequest) {
  // Check if the request URL path starts with /manage or /create.
  if (
    request.nextUrl.pathname.startsWith('/manage') ||
    request.nextUrl.pathname.startsWith('/create')
  ) {
    // Get the auth token from cookies (adjust the cookie name as needed).
    const authToken = request.cookies.get('authToken');
    console.log('Middleware: checking route', request.nextUrl.pathname, 'authToken:', authToken);
    if (!authToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      console.log('Middleware: redirecting to', loginUrl.toString());
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/manage/:path*', '/create/:path*'],
};
