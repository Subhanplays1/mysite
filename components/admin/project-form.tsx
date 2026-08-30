'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  loading?: boolean;
  onCancel: () => void;
}

export function ProjectForm({ onSubmit, initialData, loading, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = React.useState({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    longDescription: initialData?.longDescription ?? '',
    icon: initialData?.icon ?? '',
    category: initialData?.category ?? '',
    status: initialData?.status ?? 'IDEA',
    technologies: initialData?.technologies?.join(', ') ?? '',
    githubUrl: initialData?.githubUrl ?? '',
    demoUrl: initialData?.demoUrl ?? '',
    websiteUrl: initialData?.websiteUrl ?? '',
    featured: initialData?.featured ?? false,
    visibility: initialData?.visibility ?? 'PRIVATE',
    showOnRoadmap: initialData?.showOnRoadmap ?? false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      technologies: formData.technologies.split(',').map((t: string) => t.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="Project name" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Icon (Emoji)</label>
          <Input value={formData.icon} onChange={e => setFormData(prev => ({ ...prev, icon: e.target.value }))} placeholder="🎮" maxLength={2} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Short Description</label>
          <Input value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Brief description for cards" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Long Description</label>
          <textarea value={formData.longDescription} onChange={e => setFormData(prev => ({ ...prev, longDescription: e.target.value }))} className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm" rows={4} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Input value={formData.category} onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))} placeholder="e.g., Hosting, Library, Bot" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            {['IDEA', 'PLANNING', 'DEVELOPMENT', 'TESTING', 'BETA', 'RELEASED', 'PAUSED', 'ARCHIVED'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Technologies (comma separated)</label>
          <Input value={formData.technologies} onChange={e => setFormData(prev => ({ ...prev, technologies: e.target.value }))} placeholder="React, Node.js, PostgreSQL, Docker" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">GitHub URL</label>
          <Input value={formData.githubUrl} onChange={e => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))} placeholder="https://github.com/..." />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Demo URL</label>
          <Input value={formData.demoUrl} onChange={e => setFormData(prev => ({ ...prev, demoUrl: e.target.value }))} placeholder="https://demo.example.com" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Website URL</label>
          <Input value={formData.websiteUrl} onChange={e => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))} placeholder="https://example.com" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg border border-border">
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.featured} onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" /><span className="text-sm">Featured</span></label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.showOnRoadmap} onChange={e => setFormData(prev => ({ ...prev, showOnRoadmap: e.target.checked }))} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" /><span className="text-sm">Show on Roadmap</span></label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Visibility:</span>
          <select value={formData.visibility} onChange={e => setFormData(prev => ({ ...prev, visibility: e.target.value }))} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm">
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
            <option value="UNLISTED">Unlisted</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}{initialData ? 'Save Changes' : 'Create Project'}</Button>
      </div>
    </form>
  );
}