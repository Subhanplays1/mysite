import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminKey, consumeAdminKey, createSession } from '@/lib/auth';
import { prisma } from '@/lib/database';
import { logSecurityEvent, logAudit, recordFailedAttempt, recordSuccessfulAttempt } from '@/lib/security';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const userAgent = request.headers.get('user-agent') ?? 'unknown';
  
  try {
    const body = await request.json();
    const { key } = body;

    if (!key || typeof key !== 'string') {
      await recordFailedAttempt(ip);
      await logSecurityEvent('ADMIN_LOGIN_FAILED', 'warning', 'Invalid key format', { ip, userAgent });
      return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
    }

    const isValid = await verifyAdminKey(key);
    
    if (!isValid) {
      await recordFailedAttempt(ip);
      await logSecurityEvent('ADMIN_LOGIN_FAILED', 'warning', 'Invalid or expired authentication key', { ip, userAgent, keyPrefix: key.slice(0, 5) });
      return NextResponse.json({ error: 'Invalid or expired key' }, { status: 401 });
    }

    const consumed = await consumeAdminKey(key);
    
    if (!consumed) {
      await recordFailedAttempt(ip);
      await logSecurityEvent('ADMIN_LOGIN_FAILED', 'warning', 'Key already used or expired', { ip, userAgent });
      return NextResponse.json({ error: 'Key already used' }, { status: 401 });
    }

    const adminUser = await prisma.adminUser.findFirst({ where: { role: 'OWNER' } });
    
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not configured' }, { status: 500 });
    }

    await createSession({
      userId: adminUser.id,
      role: adminUser.role,
      permissions: adminUser.permissions,
      issuedAt: Date.now(),
    });

    await recordSuccessfulAttempt(ip);
    await logSecurityEvent('ADMIN_LOGIN_SUCCESS', 'info', 'Admin login successful', { ip, userAgent, userId: adminUser.id });
    await logAudit('ADMIN_LOGIN', 'auth', { userId: adminUser.id, ipAddress: ip, userAgent, result: 'SUCCESS' });

    return NextResponse.json({ success: true, redirect: '/panel-x7Kp92mQ4vL8/dashboard' });
  } catch (error) {
    console.error('Login error:', error);
    await logSecurityEvent('ADMIN_LOGIN_FAILED', 'critical', 'Login endpoint error', { ip, userAgent, error: String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}