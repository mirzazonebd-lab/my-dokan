import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Route handlers perform credential checks because webhook traffic is external.
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'same-origin');
  if (request.nextUrl.pathname.startsWith('/api/sms/')) {
    response.headers.set('Cache-Control', 'no-store');
  }
  return response;
}

export const config = { matcher: ['/api/sms/:path*'] };
