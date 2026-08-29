import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/auth';
import { checkRateLimit, recordFailedAttempt, recordSuccessfulAttempt } from './lib/security';
import { prisma } from './lib/database';

const ADMIN_ROUTE_PREFIX = '/panel-';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const userAgent = request.headers.get('user-agent') ?? 'unknown';

  if (pathname.startsWith('/api/admin/auth')) {
    const rateLimit = await checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many attempts', retryAfter: rateLimit.resetAt },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimit.resetAt! - Date.now()) / 1000)) } }
      );
    }
  }

  const isAdminRoute = pathname.startsWith(ADMIN_ROUTE_PREFIX);
  const isAdminApiRoute = pathname.startsWith('/api/admin');
  const isAuthRoute = pathname.startsWith('/api/admin/auth');

  if (isAdminRoute || isAdminApiRoute) {
    if (isAuthRoute) {
      return NextResponse.next();
    }

    const session = await getSession();
    
    if (!session) {
      if (isAdminApiRoute) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const loginUrl = new URL(`${ADMIN_ROUTE_PREFIX}login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const adminUser = await prisma.adminUser.findUnique({
      where: { id: session.userId },
    });

    if (!adminUser) {
      if (isAdminApiRoute) {
        return NextResponse.json({ error: 'User not found' }, { status: 401 });
      }
      return NextResponse.redirect(new URL(`${ADMIN_ROUTE_PREFIX}login`, request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-admin-user-id', session.userId);
    requestHeaders.set('x-admin-role', session.role);
    requestHeaders.set('x-admin-permissions', session.permissions.join(','));

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (pathname === '/api/analytics/track') {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/panel-:path*',
    '/api/admin/:path*',
    '/api/analytics/track',
  ],
};