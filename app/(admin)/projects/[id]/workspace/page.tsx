'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FolderKanban, GitBranch, FileText, StickyNote, GitCompare, CheckSquare, ArrowRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const projectTabs = [
  { id: 'overview', label: 'Overview', icon: FolderKanban },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'flowchart', label: 'Flowchart', icon: GitBranch },
  { id: 'files', label: 'Files', icon: FileText },
  { id: 'roadmap', label: 'Roadmap', icon: GitBranch },
  { id: 'notes', label: 'Notes', icon: StickyNote },
  { id: 'changelog', label: 'Changelog', icon: GitCompare },
  { id: 'settings', label: 'Settings', icon: MoreHorizontal },
];

const mockProject = {
  id: '1',
  name: 'VexPanel',
  slug: 'vexpanel',
  description: 'Modern Minecraft hosting panel with billing and Pterodactyl integration',
  status: 'DEVELOPMENT',
  category: 'Hosting',
  technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'TypeScript', 'Tailwind CSS'],
  githubUrl: 'https://github.com/SubhanPlays/vexpanel',
};

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

export default function ProjectWorkspacePage() {
  const params = useParams();
  const projectId = params.id as string;
  const [activeTab, setActiveTab] = React.useState('overview');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-sm font-medium px-2 py-1 rounded', statusColors[mockProject.status])}>
              {mockProject.status}
            </span>
            <span className="text-sm text-muted-foreground">{mockProject.category}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight font-display">{mockProject.name}</h1>
          <p className="mt-1 text-muted-foreground">{mockProject.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href={`/projects/${mockProject.slug}`} target="_blank" rel="noopener noreferrer">
              <ArrowRight className="mr-2 h-4 w-4" />
              View Public
            </a>
          </Button>
          <Button asChild>
            <a href={mockProject.githubUrl} target="_blank" rel="noopener noreferrer">
              <GitBranch className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 sm:grid-cols-8">
          {projectTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-invert max-w-none">
                  <p>{mockProject.description}</p>
                  <p>This project aims to create a modern, full-featured hosting panel for Minecraft servers with integrated billing, Pterodactyl API integration, and Discord notifications.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockProject.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded bg-muted text-sm">{tech}</span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Tasks</span>
                  <span className="font-medium">12 / 24</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Flowchart Nodes</span>
                  <span className="font-medium">18</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Files</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Notes</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Changelog Entries</span>
                  <span className="font-medium">3</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <div className="text-center py-12 text-muted-foreground">
            <CheckSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <h3 className="text-lg font-medium">Task Management</h3>
            <p className="mt-1">Kanban board with drag-and-drop, priorities, dependencies, and deadlines.</p>
            <Button className="mt-4" asChild><a href={`/panel-x7Kp92mQ4vL8/tasks?project=${projectId}`}>Open Full Task Manager <ArrowRight className="ml-2 h-4 w-4" /></a></Button>
          </div>
        </TabsContent>

        <TabsContent value="flowchart">
          <div className="text-center py-12 text-muted-foreground">
            <GitBranch className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <h3 className="text-lg font-medium">Project Flowchart</h3>
            <p className="mt-1">Visual architecture planning with React Flow, AI assistant, and auto-save.</p>
            <Button className="mt-4" asChild><a href={`/panel-x7Kp92mQ4vL8/flowcharts?project=${projectId}`}>Open Flowchart Editor <ArrowRight className="ml-2 h-4 w-4" /></a></Button>
          </div>
        </TabsContent>

        <TabsContent value="files">
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <h3 className="text-lg font-medium">File Manager</h3>
            <p className="mt-1">IDE-like file manager with Monaco Editor, versioning, and bulk operations.</p>
            <Button className="mt-4" asChild><a href={`/panel-x7Kp92mQ4vL8/files?project=${projectId}`}>Open File Manager <ArrowRight className="ml-2 h-4 w-4" /></a></Button>
          </div>
        </TabsContent>

        <TabsContent value="roadmap">
          <div className="text-center py-12 text-muted-foreground">
            <GitBranch className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <h3 className="text-lg font-medium">Project Roadmap</h3>
            <p className="mt-1">Track milestones, target dates, and progress across project phases.</p>
            <Button className="mt-4" asChild><a href={`/panel-x7Kp92mQ4vL8/roadmap?project=${projectId}`}>View Roadmap <ArrowRight className="ml-2 h-4 w-4" /></a></Button>
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <div className="text-center py-12 text-muted-foreground">
            <StickyNote className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <h3 className="text-lg font-medium">Project Notes</h3>
            <p className="mt-1">Markdown notes with autosave, code blocks, and checklists.</p>
            <Button className="mt-4" asChild><a href={`/panel-x7Kp92mQ4vL8/notes?project=${projectId}`}>Open Notes <ArrowRight className="ml-2 h-4 w-4" /></a></Button>
          </div>
        </TabsContent>

        <TabsContent value="changelog">
          <div className="text-center py-12 text-muted-foreground">
            <GitCompare className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <h3 className="text-lg font-medium">Changelog</h3>
            <p className="mt-1">Version history with release notes and release dates.</p>
            <Button className="mt-4" asChild><a href={`/panel-x7Kp92mQ4vL8/changelog?project=${projectId}`}>Manage Changelog <ArrowRight className="ml-2 h-4 w-4" /></a></Button>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Project Name</label>
                  <input defaultValue={mockProject.name} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input defaultValue={mockProject.slug} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea defaultValue={mockProject.description} className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3} />
                </div>
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}