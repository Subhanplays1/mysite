import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET() {
  const videos = await prisma.video.findMany({
    orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }],
  });
  return NextResponse.json(videos);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { youtubeId, youtubeUrl, title, description, category, tags, featured, visible } = body;

  if (!youtubeId || !title) {
    return NextResponse.json({ error: 'youtubeId and title are required' }, { status: 400 });
  }

  const maxOrder = await prisma.video.aggregate({ _max: { sortOrder: true } });
  const nextOrder = (maxOrder._max.sortOrder ?? -1) + 1;

  const video = await prisma.video.create({
    data: {
      youtubeId,
      youtubeUrl: youtubeUrl || `https://www.youtube.com/watch?v=${youtubeId}`,
      title,
      description: description || null,
      thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      category: category || null,
      tags: tags || [],
      featured: featured || false,
      visible: visible !== false,
      sortOrder: nextOrder,
      publishedAt: new Date(),
    },
  });

  return NextResponse.json(video, { status: 201 });
}
