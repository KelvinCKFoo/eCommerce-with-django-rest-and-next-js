// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('Middleware: checking route', request.nextUrl.pathname);
  if (request.nextUrl.pathname.startsWith('/manage')) {
    const token = request.cookies.get('authToken');
    console.log('Middleware: authToken value:', token);
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      console.log('Middleware: redirecting to login');
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/manage/:path*',
};
