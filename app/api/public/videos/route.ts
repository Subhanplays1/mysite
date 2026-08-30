import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  const videos = await prisma.video.findMany({
    where: { visible: true },
    orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
    select: {
      id: true,
      youtubeId: true,
      youtubeUrl: true,
      title: true,
      description: true,
      thumbnail: true,
      category: true,
      tags: true,
      views: true,
      publishedAt: true,
      featured: true,
      sortOrder: true,
    },
  });

  return NextResponse.json(videos);
}