import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { fetchChannelRSS, getYouTubeCategoryId, type YouTubeRSSVideo } from '@/lib/youtube-rss';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const cronSecret = request.headers.get('x-vercel-cron-secret') || request.nextUrl.searchParams.get('secret');
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret && cronSecret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!channelId) {
    return NextResponse.json({ error: 'YOUTUBE_CHANNEL_ID not set' }, { status: 400 });
  }

  try {
    const rssVideos = await fetchChannelRSS(channelId);
    if (rssVideos.length === 0) {
      return NextResponse.json({ message: 'No videos in feed', added: 0 });
    }

    const existingVideos = await prisma.video.findMany({
      select: { youtubeId: true },
    });
    const existingIds = new Set(existingVideos.map(v => v.youtubeId));
    const newVideos = rssVideos.filter(v => !existingIds.has(v.videoId));

    if (newVideos.length === 0) {
      return NextResponse.json({ message: 'Already up to date', added: 0 });
    }

    const maxOrder = await prisma.video.aggregate({ _max: { sortOrder: true } });
    let nextOrder = (maxOrder._max.sortOrder ?? -1) + 1;

    const created = await prisma.video.createMany({
      data: newVideos.map((video: YouTubeRSSVideo) => ({
        youtubeId: video.videoId,
        youtubeUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
        title: video.title,
        description: video.description || null,
        thumbnail: video.thumbnail,
        category: getYouTubeCategoryId(video.title, video.description),
        tags: [],
        views: 0,
        featured: false,
        visible: true,
        sortOrder: nextOrder++,
        publishedAt: video.publishedAt ? new Date(video.publishedAt) : new Date(),
      })),
    });

    return NextResponse.json({ message: `Auto-synced ${created.count} videos`, added: created.count });
  } catch (error) {
    console.error('Cron sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
