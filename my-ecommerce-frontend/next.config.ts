// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware will run for all routes starting with /manage.
export function middleware(req: NextRequest) {
  // Check if the request URL starts with /manage.
  if (req.nextUrl.pathname.startsWith('/manage')) {
    // For example, check if a specific authentication cookie exists.
    // You can adjust this logic according to how you store authentication info.
    const authToken = req.cookies.get('authToken');

    // If the auth token is missing or invalid, redirect to the login page.
    if (!authToken) {
      const loginUrl = new URL('/login', req.url);
      // Optionally, add a redirect back parameter.
      loginUrl.searchParams.set('from', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Optionally, decode the token and verify that the user is staff.
    // If the token indicates the user is not a staff member, you could redirect as well.
  }

  // If everything is fine, allow the request to continue.
  return NextResponse.next();
}

// Specify that this middleware only applies to routes under /manage.
export const config = {
  matcher: '/manage/:path*',
};
