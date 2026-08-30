import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const video = await prisma.video.findUnique({ where: { id } });
  if (!video) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(video);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.video.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const video = await prisma.video.update({
    where: { id },
    data: {
      youtubeId: body.youtubeId ?? existing.youtubeId,
      youtubeUrl: body.youtubeUrl ?? existing.youtubeUrl,
      title: body.title ?? existing.title,
      description: body.description !== undefined ? body.description : existing.description,
      thumbnail: body.youtubeId ? `https://img.youtube.com/vi/${body.youtubeId}/hqdefault.jpg` : existing.thumbnail,
      category: body.category !== undefined ? body.category : existing.category,
      tags: body.tags ?? existing.tags,
      views: body.views ?? existing.views,
      featured: body.featured ?? existing.featured,
      visible: body.visible ?? existing.visible,
      sortOrder: body.sortOrder ?? existing.sortOrder,
    },
  });

  return NextResponse.json(video);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = await prisma.video.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.video.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
