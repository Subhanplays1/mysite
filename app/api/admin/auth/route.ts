import { NextRequest, NextResponse } from 'next/server';
import { generateAdminKey, storeAdminKey } from '@/lib/auth';
import { getActiveAdminKey } from '@/lib/auth';
import { sendSecurityAlert, sendAdminKeyNotification } from '@/lib/discord';

const SITE_URL = process.env.SITE_URL ?? 'http://localhost:3000';

function getAdminRoute(): string {
  return process.env.ADMIN_ROUTE ?? '/panel-x7Kp92mQ4vL8';
}

export async function GET() {
  const adminRoute = getAdminRoute();
  const keyInfo = await getActiveAdminKey();
  
  return NextResponse.json({
    adminUrl: `${SITE_URL}${adminRoute}`,
    keyExpiresAt: keyInfo?.expiresAt ?? null,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const action = body.action;

  if (action === 'generate') {
    try {
      const newKey = await generateAdminKey();
      await storeAdminKey(newKey, 'manual');
      
      const adminRoute = getAdminRoute();
      const adminUrl = `${SITE_URL}${adminRoute}`;
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      await sendAdminKeyNotification(newKey, adminUrl, expiresAt);
      
      await sendSecurityAlert('ADMIN_KEY_GENERATED', 'New admin authentication key generated manually', {
        expiresAt: expiresAt.toISOString(),
      }, 'info');
      
      return NextResponse.json({ success: true, key: newKey, expiresAt });
    } catch (error) {
      console.error('Key generation failed:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json({ error: 'Failed to generate key', details: message }, { status: 500 });
    }
  }

  if (action === 'revoke') {
    const { revokeAdminKey } = await import('@/lib/auth');
    await revokeAdminKey();
    
    await sendSecurityAlert('ADMIN_KEY_REVOKED', 'Admin authentication key revoked manually', {}, 'warning');
    
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}