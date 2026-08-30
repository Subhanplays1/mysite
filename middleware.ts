import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const ADMIN_ROUTE_PREFIX = '/panel-';

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? 'dev-secret-change-in-production'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith(ADMIN_ROUTE_PREFIX);
  const isAdminApiRoute = pathname.startsWith('/api/admin');
  const isAuthRoute = pathname.startsWith('/api/admin/auth');

  if (isAdminRoute || isAdminApiRoute) {
    if (isAuthRoute) {
      return NextResponse.next();
    }

    const token = request.cookies.get('sp_admin_session')?.value;

    if (!token) {
      if (isAdminApiRoute) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const loginUrl = new URL(`${ADMIN_ROUTE_PREFIX}login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, SESSION_SECRET);
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-admin-user-id', payload.userId as string);
      requestHeaders.set('x-admin-role', payload.role as string);
      requestHeaders.set('x-admin-permissions', (payload.permissions as string[]).join(','));
      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch {
      if (isAdminApiRoute) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
      }
      const loginUrl = new URL(`${ADMIN_ROUTE_PREFIX}login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/panel-:path*',
    '/api/admin/:path*',
  ],
};
