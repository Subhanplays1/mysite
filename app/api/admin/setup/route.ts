import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { generateAdminKey, storeAdminKey } from '@/lib/auth';
import { sendAdminKeyNotification } from '@/lib/discord';

export async function POST() {
  try {
    const existing = await prisma.adminUser.findFirst({ where: { role: 'OWNER' } });
    if (existing) {
      return NextResponse.json({ error: 'Admin user already exists' }, { status: 400 });
    }

    const adminUser = await prisma.adminUser.create({
      data: {
        email: 'owner@subhanplays.qzz.io',
        name: 'Subhan',
        role: 'OWNER',
        permissions: [
          'manage_videos',
          'manage_projects',
          'manage_tasks',
          'manage_files',
          'manage_flowcharts',
          'manage_website',
          'manage_media',
          'view_analytics',
          'view_security',
          'manage_admins',
        ],
      },
    });

    const key = await generateAdminKey();
    await storeAdminKey(key, adminUser.id);

    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
    const adminRoute = process.env.ADMIN_ROUTE || '/panel-x7Kp92mQ4vL8';
    const adminUrl = `${siteUrl}${adminRoute}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await sendAdminKeyNotification(key, adminUrl, expiresAt);

    return NextResponse.json({
      success: true,
      message: 'Admin user created and initial key generated',
      key,
      adminUrl,
      expiresAt,
    });
  } catch (error) {
    console.error('Setup failed:', error);
    return NextResponse.json(
      { error: 'Setup failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
