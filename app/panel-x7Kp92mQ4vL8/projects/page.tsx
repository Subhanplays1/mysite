'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, FolderKanban, Code, ExternalLink, Loader2, MoreHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';
import { ProjectForm } from '@/components/admin/project-form';

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

const mockProjects = [
  { id: '1', name: 'VexPanel', slug: 'vexpanel', description: 'Modern Minecraft hosting panel with billing', longDescription: 'A full-featured hosting panel...', icon: '🎮', coverImage: '', status: 'DEVELOPMENT', category: 'Hosting', technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker'], githubUrl: 'https://github.com/SubhanPlays/vexpanel', demoUrl: '', websiteUrl: '', featured: true, visibility: 'PUBLIC', showOnRoadmap: true, sortOrder: 0 },
  { id: '2', name: 'SubhanBot', slug: 'subhanbot', description: 'Discord bot for server management', longDescription: '', icon: '🤖', coverImage: '', status: 'RELEASED', category: 'Bot', technologies: ['TypeScript', 'Discord.js', 'PostgreSQL'], githubUrl: 'https://github.com/SubhanPlays/subhanbot', demoUrl: '', websiteUrl: '', featured: false, visibility: 'PUBLIC', showOnRoadmap: true, sortOrder: 1 },
  { id: '3', name: 'MinecraftUtils', slug: 'minecraftutils', description: 'Utility library for Minecraft server development', longDescription: '', icon: '📦', coverImage: '', status: 'BETA', category: 'Library', technologies: ['Java', 'Maven', 'PaperMC'], githubUrl: 'https://github.com/SubhanPlays/minecraftutils', demoUrl: '', websiteUrl: '', featured: false, visibility: 'PRIVATE', showOnRoadmap: false, sortOrder: 2 },
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = React.useState(mockProjects);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [visibilityFilter, setVisibilityFilter] = React.useState('all');
  const [showModal, setShowModal] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const statuses = ['IDEA', 'PLANNING', 'DEVELOPMENT', 'TESTING', 'BETA', 'RELEASED', 'PAUSED', 'ARCHIVED'];
  const visibilities = ['PUBLIC', 'PRIVATE', 'UNLISTED'];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesVisibility = visibilityFilter === 'all' || p.visibility === visibilityFilter;
    return matchesSearch && matchesStatus && matchesVisibility;
  });

  const handleAddProject = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleSaveProject = async (data: any) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...data } : p));
    } else {
      const newProject = { ...data, id: Date.now().toString(), slug: data.name.toLowerCase().replace(/\s+/g, '-'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setProjects([...projects, newProject]);
    }
    
    setShowModal(false);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Projects</h1>
          <p className="mt-1 text-muted-foreground">Manage your projects, workspaces, and public portfolio.</p>
        </div>
        <Button onClick={handleAddProject}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-40">
          <option value="all">All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={visibilityFilter} onChange={(e) => setVisibilityFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-40">
          <option value="all">All Visibility</option>
          {visibilities.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Visibility</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tech Stack</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Updated</th>
                    <th className="p-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project, index) => (
                      <motion.tr
                        key={project.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="border-b border-border hover:bg-accent/50"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg">{project.icon}</div>
                            <div>
                              <p className="font-medium truncate max-w-xs">{project.name}</p>
                              <p className="text-xs text-muted-foreground">{project.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={cn('text-xs font-medium px-2 py-1 rounded', statusColors[project.status])}>{project.status}</span>
                        </td>
                        <td className="p-3 text-sm">{project.category}</td>
                        <td className="p-3">
                          <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground capitalize">{project.visibility.toLowerCase()}</span>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.slice(0, 3).map(t => <span key={t} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">{t}</span>)}
                            {project.technologies.length > 3 && <span className="text-xs text-muted-foreground">+{project.technologies.length - 3}</span>}
                          </div>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">{formatRelativeTime(project.updatedAt)}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" asChild>
                              <a href={`/panel-x7Kp92mQ4vL8/projects/${project.id}/workspace`}>
                                <FolderKanban className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditProject(project)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project.id)} className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {filteredProjects.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">No projects found. Create your first project!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-card border border-border p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{editingProject ? 'Edit Project' : 'New Project'}</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}><X className="h-5 w-5" /></Button>
              </div>
              <ProjectForm onSubmit={handleSaveProject} initialData={editingProject} loading={loading} onCancel={() => setShowModal(false)} />
            </motion.div>
          }
        )}
      </AnimatePresence>
    </div>
  );
}
