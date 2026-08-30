import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: ['hero_title', 'hero_subtitle', 'hero_description', 'hero_image', 'about_title', 'about_text', 'about_image', 'stats', 'social_links', 'seo_title', 'seo_description', 'seo_image'] } },
  });

  return NextResponse.json(Object.fromEntries(settings.map(s => [s.key, s.value])));
}