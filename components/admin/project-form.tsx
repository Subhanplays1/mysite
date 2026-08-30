'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  loading?: boolean;
  onCancel: () => void;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' },
  }),
};

export function ProjectForm({ onSubmit, initialData, loading, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = React.useState({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    longDescription: initialData?.longDescription ?? '',
    icon: initialData?.icon ?? '',
    coverImage: initialData?.coverImage ?? '',
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible" className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Basic Info</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="Project name" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Icon (Emoji)</label>
            <Input value={formData.icon} onChange={e => setFormData(prev => ({ ...prev, icon: e.target.value }))} placeholder="🎮" maxLength={4} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Short Description</label>
            <Input value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Brief description for cards" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Long Description</label>
            <textarea value={formData.longDescription} onChange={e => setFormData(prev => ({ ...prev, longDescription: e.target.value }))} className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm" rows={4} />
          </div>
        </div>
      </motion.div>

      <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible" className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Cover Image</h3>
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={formData.coverImage}
                  onChange={e => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                  placeholder="https://example.com/image.png"
                  className="pl-10"
                />
              </div>
              {formData.coverImage && (
                <Button type="button" variant="ghost" size="icon" onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        <AnimatePresence>
          {formData.coverImage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden rounded-lg border border-border"
            >
              <img
                src={formData.coverImage}
                alt="Cover preview"
                className="w-full aspect-video object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible" className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
      </motion.div>

      <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="visible" className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Links</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium mb-1">GitHub URL</label>
            <Input value={formData.githubUrl} onChange={e => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))} placeholder="https://github.com/..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Demo URL</label>
            <Input value={formData.demoUrl} onChange={e => setFormData(prev => ({ ...prev, demoUrl: e.target.value }))} placeholder="https://demo.example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website URL</label>
            <Input value={formData.websiteUrl} onChange={e => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))} placeholder="https://example.com" />
          </div>
        </div>
      </motion.div>

      <motion.div custom={4} variants={sectionVariants} initial="hidden" animate="visible">
        <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg border border-border bg-muted/30">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={formData.featured} onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
            <span className="text-sm group-hover:text-foreground transition-colors">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={formData.showOnRoadmap} onChange={e => setFormData(prev => ({ ...prev, showOnRoadmap: e.target.checked }))} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
            <span className="text-sm group-hover:text-foreground transition-colors">Show on Roadmap</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Visibility:</span>
            <select value={formData.visibility} onChange={e => setFormData(prev => ({ ...prev, visibility: e.target.value }))} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm">
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
              <option value="UNLISTED">Unlisted</option>
            </select>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}{initialData ? 'Save Changes' : 'Create Project'}</Button>
      </div>
    </form>
  );
}
