'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Youtube } from 'lucide-react';

interface VideoFormProps {
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

export function VideoForm({ onSubmit, initialData, loading, onCancel }: VideoFormProps) {
  const [formData, setFormData] = React.useState({
    youtubeUrl: initialData?.youtubeUrl ?? '',
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    category: initialData?.category ?? '',
    featured: initialData?.featured ?? false,
    visible: initialData?.visible ?? true,
  });

  const [youtubeId, setYoutubeId] = React.useState(initialData?.youtubeId ?? '');

  React.useEffect(() => {
    if (formData.youtubeUrl) {
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
        /youtube\.com\/shorts\/([^&\n?#]+)/,
      ];
      for (const pattern of patterns) {
        const match = formData.youtubeUrl.match(pattern);
        if (match) {
          setYoutubeId(match[1]);
          break;
        }
      }
    }
  }, [formData.youtubeUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, youtubeId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible" className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">YouTube URL</label>
          <div className="relative">
            <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={formData.youtubeUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=..."
              className="pl-10"
              required
            />
          </div>
          <AnimatePresence>
            {youtubeId && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1 text-sm text-green-500"
              >
                Detected Video ID: <code className="bg-muted px-1 rounded">{youtubeId}</code>
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {youtubeId && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden rounded-lg border border-border"
            >
              <img
                src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                alt="Video thumbnail preview"
                className="w-full aspect-video object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible" className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Video title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select category</option>
            <option value="Minecraft">Minecraft</option>
            <option value="Coding">Coding</option>
            <option value="Linux">Linux</option>
            <option value="Hosting">Hosting</option>
            <option value="Gaming">Gaming</option>
            <option value="Technology">Technology</option>
          </select>
        </div>
      </motion.div>

      <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible">
        <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-muted/30">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm group-hover:text-foreground transition-colors">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.visible}
              onChange={(e) => setFormData(prev => ({ ...prev, visible: e.target.checked }))}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm group-hover:text-foreground transition-colors">Visible</span>
          </label>
        </div>
      </motion.div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {initialData ? 'Save Changes' : 'Add Video'}
        </Button>
      </div>
    </form>
  );
}
