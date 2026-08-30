import { Metadata } from 'next';
import { prisma } from '@/lib/database';
import { Button } from '@/components/ui/button';
import { Code, Github, ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Projects — SubhanPlays',
  description: 'Explore all projects by SubhanPlays — Minecraft servers, hosting panels, developer tools, and open source software.',
};

async function getProjects() {
  return prisma.project.findMany({
    where: { visibility: 'PUBLIC' },
    orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { updatedAt: 'desc' }],
  });
}

async function getCategories() {
  const projects = await prisma.project.findMany({
    where: { visibility: 'PUBLIC', category: { not: null } },
    select: { category: true },
    distinct: ['category'],
  });
  return projects.map(p => p.category).filter(Boolean) as string[];
}

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([getProjects(), getCategories()]);

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

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-display">Projects</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Software, tools, and infrastructure projects I'm building and maintaining.
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" id="projects-grid">
          {projects.map((project) => (
            <article
              key={project.id}
              className="project-card group rounded-xl overflow-hidden bg-card border border-border transition-all hover:border-primary/50 hover:shadow-lg"
              data-category={project.category ?? 'uncategorized'}
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
                <div className="absolute top-3 left-3">
                  <span className={cn('text-xs font-medium px-2 py-1 rounded', statusColors[project.status] ?? 'bg-muted text-muted-foreground')}>
                    {project.status}
                  </span>
                </div>
                {project.featured && (
                  <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold group-hover:text-primary transition-colors flex-1">
                    <a href={`/projects/${project.slug}`}>{project.name}</a>
                  </h3>
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {project.technologies.slice(0, 5).map((tech) => (
                    <span key={tech} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Demo
                    </a>
                  )}
                  {project.websiteUrl && (
                    <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20">
            <Code className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 text-xl font-semibold">No public projects yet</h3>
            <p className="mt-2 text-muted-foreground">Projects will appear here once created and marked as public.</p>
          </div>
        )}
      </div>
    </div>
  );
}