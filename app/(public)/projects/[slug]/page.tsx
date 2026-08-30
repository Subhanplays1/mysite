import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/database';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink, Clock, Tag, FolderOpen } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug, visibility: 'PUBLIC' },
  });
  
  if (!project) {
    return { title: 'Project Not Found' };
  }
  
  return {
    title: `${project.name} — SubhanPlays`,
    description: project.description ?? `Explore ${project.name} — a ${project.category?.toLowerCase() ?? 'project'} by SubhanPlays.`,
    openGraph: {
      title: project.name,
      description: project.description ?? '',
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

async function getProject(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: {
      changelog: { orderBy: { releasedAt: 'desc' }, take: 10 },
      roadmapItems: { orderBy: { sortOrder: 'asc' } },
    },
  });
}

const statusColors: Record<string, string> = {
  IDEA: 'bg-gray-500/20 text-gray-400',
  PLANNING: 'bg-blue-500/20 text-blue-400',
  DEVELOPMENT: 'bg-purple-500/20 text-purple-400',
  TESTING: 'bg-yellow-500/20 text-yellow-400',
  BETA: 'bg-orange-500/20 text-orange-400',
  RELEASED: 'bg-green-500/20 text-green-400',
  PAUSED: 'bg-gray-500/20 text-gray-400',
  ARCHIVED: 'bg-gray-500/20 text-gray-400',
};

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  
  if (!project || project.visibility !== 'PUBLIC') {
    notFound();
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/projects" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <article>
              <header className="mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={cn('text-sm font-medium px-3 py-1 rounded', statusColors[project.status])}>
                    {project.status}
                  </span>
                  {project.category && (
                    <span className="text-sm text-muted-foreground">{project.category}</span>
                  )}
                  {project.featured && (
                    <span className="text-sm px-3 py-1 rounded bg-primary/10 text-primary">Featured</span>
                  )}
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-display">{project.name}</h1>
                {project.longDescription && (
                  <div className="mt-6 prose prose-invert max-w-none">
                    <p className="text-lg text-muted-foreground">{project.longDescription}</p>
                  </div>
                )}
              </header>

              <div className="grid gap-4 sm:grid-cols-2">
                {project.githubUrl && (
                  <Button asChild variant="outline">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      View on GitHub
                    </a>
                  </Button>
                )}
                {project.demoUrl && (
                  <Button asChild variant="outline">
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                )}
                {project.websiteUrl && (
                  <Button asChild variant="outline">
                    <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Website
                    </a>
                  </Button>
                )}
              </div>

              {project.technologies.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold">Technologies</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-3 py-1 rounded bg-muted text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {project.changelog.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold">Changelog</h2>
                  <div className="mt-4 space-y-4">
                    {project.changelog.map((entry) => (
                      <article key={entry.id} className="rounded-lg border border-border p-4 bg-card">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{entry.version}</h3>
                          {entry.releasedAt && (
                            <time className="text-sm text-muted-foreground">{formatRelativeTime(entry.releasedAt)}</time>
                          )}
                        </div>
                        {entry.title && <h4 className="mt-1 font-medium">{entry.title}</h4>}
                        <div className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{entry.content}</div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {project.roadmapItems.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold">Roadmap</h2>
                  <div className="mt-4 space-y-3">
                    {project.roadmapItems.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="text-xs font-medium">
                            {item.status === 'RELEASED' ? '✓' : item.status === 'DEVELOPMENT' ? '◐' : '○'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.title}</h3>
                          {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                          {item.targetDate && (
                            <time className="text-xs text-muted-foreground">Target: {formatRelativeTime(item.targetDate)}</time>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </article>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold">Project Info</h3>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="font-medium capitalize">{project.status.toLowerCase()}</dd>
                </div>
                {project.category && (
                  <div>
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="font-medium">{project.category}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-muted-foreground">Technologies</dt>
                  <dd className="font-medium">{project.technologies.length}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Updated</dt>
                  <dd className="font-medium">{formatRelativeTime(project.updatedAt)}</dd>
                </div>
              </dl>
            </div>

            {project.coverImage && (
              <div className="rounded-xl overflow-hidden border border-border">
                <img src={project.coverImage} alt={project.name} className="aspect-video w-full object-cover" />
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}