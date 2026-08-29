import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';
import { prisma } from '@/lib/database';
import { logAudit } from '@/lib/security';

export async function POST() {
  await deleteSession();
  
  await logAudit('ADMIN_LOGOUT', 'auth', { result: 'SUCCESS' });
  
  return NextResponse.json({ success: true });
}