'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  loading?: boolean;
  onCancel: () => void;
}

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">YouTube URL</label>
        <Input
          value={formData.youtubeUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
          placeholder="https://www.youtube.com/watch?v=..."
          required
        />
        {youtubeId && (
          <p className="mt-1 text-sm text-green-500">Detected Video ID: <code>{youtubeId}</code></p>
        )}
      </div>

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

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm">Featured</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.visible}
            onChange={(e) => setFormData(prev => ({ ...prev, visible: e.target.checked }))}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm">Visible</span>
        </label>
      </div>

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