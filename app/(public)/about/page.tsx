import { Metadata } from 'next';
import { prisma } from '@/lib/database';
import { Button } from '@/components/ui/button';
import { Code, Server, Gamepad2, Github, Youtube, X, Mail, Heart } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — SubhanPlays',
  description: 'Learn more about SubhanPlays — Minecraft creator, developer, and technology enthusiast.',
};

async function getAboutSettings() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: ['about_title', 'about_text', 'about_image', 'stats'] } },
  });
  return Object.fromEntries(settings.map(s => [s.key, s.value]));
}

export default async function AboutPage() {
  const settings = await getAboutSettings();
  
  const stats = (settings.stats as Array<{ label: string; value: string }>) ?? [
    { label: 'Videos', value: '100+' },
    { label: 'Projects', value: '20+' },
    { label: 'Subscribers', value: '10K+' },
    { label: 'Years Active', value: '5+' },
  ];

  const topics = [
    { icon: Gamepad2, title: 'Minecraft & Gaming', desc: 'Custom servers, plugins, modpacks, and gaming content creation.' },
    { icon: Code, title: 'Software Development', desc: 'Full-stack web apps, CLI tools, libraries, and open source contributions.' },
    { icon: Server, title: 'Infrastructure & Hosting', desc: 'Linux systems, containerization, cloud architecture, and game server hosting.' },
  ];

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-display">About</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Hi, I'm Subhan. I create content around Minecraft, coding, and technology.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Who Am I?</h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p>
                I'm a Minecraft creator, developer, and technology enthusiast. My journey started with playing Minecraft,
                which led me to server administration, plugin development, and eventually full-stack software development.
              </p>
              <p>
                Today, I build hosting panels, developer tools, infrastructure automation, and share my learnings through
                videos and open source projects. My focus is on creating practical solutions for real problems.
              </p>
              <p>
                When I'm not coding, you'll find me experimenting with new technologies, optimizing server performance,
                or planning the next big project.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-8">
            <h3 className="font-semibold mb-4">What I Work With</h3>
            <div className="space-y-4">
              {topics.map((topic) => (
                <div key={topic.title} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <topic.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium">{topic.title}</h4>
                    <p className="text-sm text-muted-foreground">{topic.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-xl border border-border bg-card">
              <div className="text-3xl sm:text-4xl font-bold font-display">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-6 text-center">Connect With Me</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="https://www.youtube.com/@NotSubhanplayz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
              <Youtube className="h-5 w-5" />
              YouTube
            </a>
            <a href="https://github.com/SubhanPlays" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-colors">
              <Github className="h-5 w-5" />
              GitHub
            </a>
            <a href="https://discord.gg/subhanplays" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
              Discord
            </a>
            <a href="https://x.com/NotSubhanplayz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-colors">
              <X className="h-5 w-5" />
              X (Twitter)
            </a>
            <a href="mailto:contact@subhanplays.qzz.io" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-colors">
              <Mail className="h-5 w-5" />
              Email
            </a>
          </div>
        </div>

        <div className="text-center py-8 border-t border-border">
          <p className="text-muted-foreground">
            Built with{' '}
            <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Next.js</a>
            {' '},{' '}
            <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Tailwind CSS</a>
            {' '},{' '}
            <a href="https://www.typescriptlang.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TypeScript</a>
            {' '}and{' '}
            <Heart className="inline h-4 w-4 text-red-500" />
          </p>
        </div>
      </div>
    </div>
  );
}