import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { fetchChannelRSS, getYouTubeCategoryId, type YouTubeRSSVideo } from '@/lib/youtube-rss';

export const dynamic = 'force-dynamic';

export async function POST() {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!channelId) {
    return NextResponse.json(
      { error: 'YOUTUBE_CHANNEL_ID environment variable is not set. Add it to your Vercel env vars.' },
      { status: 400 }
    );
  }

  try {
    const rssVideos = await fetchChannelRSS(channelId);
    if (rssVideos.length === 0) {
      return NextResponse.json({ error: 'No videos found in RSS feed. Check your YOUTUBE_CHANNEL_ID.' }, { status: 404 });
    }

    const existingVideos = await prisma.video.findMany({
      select: { youtubeId: true },
    });
    const existingIds = new Set(existingVideos.map(v => v.youtubeId));

    const newVideos = rssVideos.filter(v => !existingIds.has(v.videoId));

    if (newVideos.length === 0) {
      return NextResponse.json({ message: 'All videos already synced', added: 0, total: rssVideos.length });
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

    return NextResponse.json({
      message: `Synced ${created.count} new videos`,
      added: created.count,
      total: rssVideos.length,
      alreadyExisted: rssVideos.length - created.count,
      newVideos: newVideos.map(v => ({ id: v.videoId, title: v.title })),
    });
  } catch (error) {
    console.error('YouTube sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync videos', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
