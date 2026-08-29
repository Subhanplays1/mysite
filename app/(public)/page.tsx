import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Youtube, ArrowRight, Code, Server, Gamepad2 } from 'lucide-react';
import { prisma } from '@/lib/database';

export const metadata: Metadata = {
  title: 'SubhanPlays — Gaming, Coding & Technology',
  description: 'SubhanPlays — Minecraft, gaming, coding, hosting, and technology. Explore videos, projects, and everything I\'m building.',
};

async function getFeaturedVideo() {
  return prisma.video.findFirst({
    where: { featured: true, visible: true },
    orderBy: { sortOrder: 'asc' },
  });
}

async function getLatestVideos() {
  return prisma.video.findMany({
    where: { visible: true },
    orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
    take: 6,
  });
}

async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { featured: true, visibility: 'PUBLIC' },
    orderBy: { sortOrder: 'asc' },
    take: 3,
  });
}

async function getSiteSettings() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: ['hero_title', 'hero_subtitle', 'hero_description', 'hero_image', 'about_title', 'about_text', 'about_image'] } },
  });
  return Object.fromEntries(settings.map(s => [s.key, s.value]));
}

export default async function HomePage() {
  const [featuredVideo, latestVideos, featuredProjects, settings] = await Promise.all([
    getFeaturedVideo(),
    getLatestVideos(),
    getFeaturedProjects(),
    getSiteSettings(),
  ]);

  const heroTitle = (settings.hero_title as string) ?? 'SUBHANPLAYS';
  const heroSubtitle = (settings.hero_subtitle as string) ?? 'Gaming. Coding. Creating.';
  const heroDescription = (settings.hero_description as string) ?? 'Minecraft creator, developer, and technology enthusiast building servers, software, and digital experiences.';

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card/30" />
        {settings.hero_image && (
          <div className="absolute inset-0 opacity-10">
            <img
              src={settings.hero_image as string}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight font-display text-balance"
            >
              {heroTitle}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-xl sm:text-2xl lg:text-3xl text-muted-foreground font-medium text-balance"
            >
              {heroSubtitle}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto text-balance"
            >
              {heroDescription}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button asChild size="xl" className="group">
                <a href="https://www.youtube.com/@NotSubhanplayz" target="_blank" rel="noopener noreferrer">
                  <Youtube className="mr-2 h-5 w-5" />
                  Watch on YouTube
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button asChild variant="outline" size="xl">
                <a href="/projects">
                  Explore Projects
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        >
          <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {featuredVideo && (
        <section className="py-20 bg-card/30 border-y border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-display">Featured Video</h2>
              <p className="mt-2 text-muted-foreground">Latest featured content from the channel</p>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden bg-muted">
              <iframe
                src={`https://www.youtube.com/embed/${featuredVideo.youtubeId}`}
                title={featuredVideo.title}
                className="h-full w-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold">{featuredVideo.title}</h3>
              <p className="mt-2 text-muted-foreground line-clamp-2">{featuredVideo.description}</p>
            </div>
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-display">Latest Videos</h2>
              <p className="mt-2 text-muted-foreground">Recent uploads from the channel</p>
            </div>
            <Button asChild variant="ghost">
              <a href="/videos">View All <ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestVideos.filter(v => !v.featured).map((video) => (
              <article
                key={video.id}
                className="group rounded-xl overflow-hidden bg-card border border-border transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail ?? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.views ? `${(video.views / 1000).toFixed(1)}K views` : 'New'}
                  </div>
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
                        <time dateTime={video.publishedAt}>{new Date(video.publishedAt).toLocaleDateString()}</time>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-card/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-display">Featured Projects</h2>
            <p className="mt-2 text-muted-foreground">Projects I'm currently building and maintaining</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <article
                key={project.id}
                className="group rounded-xl overflow-hidden bg-card border border-border transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="aspect-video relative overflow-hidden bg-muted">
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt={project.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <Code className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">
                      {project.status}
                    </span>
                    {project.category && (
                      <span className="text-xs text-muted-foreground">{project.category}</span>
                    )}
                  </div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    <Link href={`/projects/${project.slug}`}>{project.name}</Link>
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span key={tech} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg">
              <a href="/projects">View All Projects <ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <Gamepad2 className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Minecraft & Gaming</h3>
              <p className="mt-2 text-muted-foreground">Custom servers, plugins, and gaming content</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <Code className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Software Development</h3>
              <p className="mt-2 text-muted-foreground">Full-stack apps, tools, and open source</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <Server className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Infrastructure & Hosting</h3>
              <p className="mt-2 text-muted-foreground">Linux, containers, and cloud architecture</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}