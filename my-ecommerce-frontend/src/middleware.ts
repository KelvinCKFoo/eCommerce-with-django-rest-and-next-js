// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware will run for all routes starting with /manage.
export function middleware(req: NextRequest) {
  // Check if the request URL starts with /manage.
  if (req.nextUrl.pathname.startsWith('/manage')) {
    // Check if a specific authentication cookie exists.
    const authToken = req.cookies.get('authToken');

    // If the auth token is missing or invalid, redirect to the login page.
    if (!authToken) {
      const loginUrl = new URL('/login', req.url);
      // Optionally, add a redirect back parameter.
      loginUrl.searchParams.set('from', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  // If everything is fine, allow the request to continue.
  return NextResponse.next();
}

// Specify that this middleware applies to routes under /manage.
export const config = {
  matcher: '/manage/:path*',
};
