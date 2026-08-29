import { Metadata } from 'next';
import { prisma } from '@/lib/database';
import { Button } from '@/components/ui/button';
import { Youtube, Loader2 } from 'lucide-react';
import { formatNumber, formatRelativeTime } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Videos — SubhanPlays',
  description: 'Watch all videos from SubhanPlays — Minecraft, gaming, coding, hosting, and technology content.',
};

async function getVideos() {
  return prisma.video.findMany({
    where: { visible: true },
    orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
  });
}

async function getCategories() {
  const videos = await prisma.video.findMany({
    where: { visible: true, category: { not: null } },
    select: { category: true },
    distinct: ['category'],
  });
  return videos.map(v => v.category).filter(Boolean) as string[];
}

export default async function VideosPage() {
  const [videos, categories] = await Promise.all([getVideos(), getCategories()]);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-display">Videos</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            All content from the SubhanPlays YouTube channel — Minecraft, coding, hosting, and more.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          <Button variant="outline" className="bg-primary text-primary-foreground" data-category="all">
            All
          </Button>
          {categories.map((category) => (
            <Button key={category} variant="outline" data-category={category}>
              {category}
            </Button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" id="videos-grid">
          {videos.map((video) => (
            <article
              key={video.id}
              className="video-card group rounded-xl overflow-hidden bg-card border border-border transition-all hover:border-primary/50 hover:shadow-lg"
              data-category={video.category ?? 'uncategorized'}
            >
              <div className="relative aspect-video overflow-hidden">
                <a href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer">
                  <img
                    src={video.thumbnail ?? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:opacity-0" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Youtube className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {video.views ? `${(video.views / 1000).toFixed(1)}K views` : 'New'}
                </div>
                {video.featured && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  <a href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer">
                    {video.title}
                  </a>
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  {video.category && <span>{video.category}</span>}
                  {video.publishedAt && (
                    <>
                      <span>·</span>
                      <time dateTime={video.publishedAt}>{formatRelativeTime(video.publishedAt)}</time>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {videos.length === 0 && (
          <div className="text-center py-20">
            <Youtube className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 text-xl font-semibold">No videos yet</h3>
            <p className="mt-2 text-muted-foreground">Videos will appear here once added from the admin panel.</p>
          </div>
        )}
      </div>
    </div>
  );
}