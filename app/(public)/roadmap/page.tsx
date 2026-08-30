import { Metadata } from 'next';
import { prisma } from '@/lib/database';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertCircle, Loader2, Code, Rocket } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Roadmap — SubhanPlays',
  description: 'View the public roadmap for SubhanPlays projects — upcoming features, releases, and project milestones.',
};

async function getRoadmapItems() {
  return prisma.roadmapItem.findMany({
    where: {
      project: { visibility: 'PUBLIC', showOnRoadmap: true },
    },
    include: {
      project: { select: { id: true, name: true, slug: true, status: true, category: true } },
    },
    orderBy: [{ status: 'asc' }, { targetDate: 'asc' }, { sortOrder: 'asc' }],
  });
}

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  IDEA: { icon: <Code className="h-4 w-4" />, label: 'Idea', color: 'text-gray-400 bg-gray-500/20' },
  PLANNING: { icon: <Clock className="h-4 w-4" />, label: 'Planning', color: 'text-blue-400 bg-blue-500/20' },
  DEVELOPMENT: { icon: <Loader2 className="h-4 w-4 animate-spin" />, label: 'Development', color: 'text-purple-400 bg-purple-500/20' },
  TESTING: { icon: <AlertCircle className="h-4 w-4" />, label: 'Testing', color: 'text-yellow-400 bg-yellow-500/20' },
  RELEASED: { icon: <CheckCircle className="h-4 w-4" />, label: 'Released', color: 'text-green-400 bg-green-500/20' },
};

export default async function RoadmapPage() {
  const items = await getRoadmapItems();

  const grouped = items.reduce((acc, item) => {
    const status = item.status;
    if (!acc[status]) acc[status] = [];
    acc[status].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const statusOrder = ['IDEA', 'PLANNING', 'DEVELOPMENT', 'TESTING', 'RELEASED'];

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-display">Roadmap</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparent view of what's coming next. Public projects with roadmap visibility enabled.
          </p>
        </div>

        <div className="space-y-10">
          {statusOrder.map((status) => {
            const statusItems = grouped[status];
            if (!statusItems?.length) return null;
            const config = statusConfig[status];
            return (
              <section key={status} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-full', config.color)}>
                    {config.icon}
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">{config.label}</h2>
                  <span className="ml-auto text-sm text-muted-foreground">{statusItems.length} item{statusItems.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="ml-11 space-y-3 border-l border-border/50 pl-6">
                  {statusItems.map((item) => (
                    <article key={item.id} className="relative group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {status === 'RELEASED' ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : status === 'DEVELOPMENT' ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <span className="text-xs font-medium">{status === 'IDEA' ? '●' : '○'}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate">
                              <a href={`/projects/${item.project.slug}`} className="hover:text-primary transition-colors">
                                {item.title}
                              </a>
                            </h3>
                            <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground whitespace-nowrap">
                              {item.project.name}
                            </span>
                          </div>
                          {item.description && (
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                          )}
                          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                            {item.targetDate && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                Target: {formatRelativeTime(item.targetDate)}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Rocket className="h-3.5 w-3.5" />
                              {item.project.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="text-center py-20">
            <Rocket className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 text-xl font-semibold">Roadmap is empty</h3>
            <p className="mt-2 text-muted-foreground">Public roadmap items will appear here as projects are planned.</p>
          </div>
        )}
      </div>
    </div>
  );
}