'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Star, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime, formatNumber } from '@/lib/utils';
import { VideoForm } from '@/components/admin/video-form';

export default function AdminVideosPage() {
  const [videos, setVideos] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [showModal, setShowModal] = React.useState(false);
  const [editingVideo, setEditingVideo] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);

  const categories = ['Minecraft', 'Coding', 'Linux', 'Hosting', 'Gaming', 'Technology'];

  React.useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    setFetching(true);
    try {
      const res = await fetch('/api/admin/videos');
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (e) {
      console.error('Failed to fetch videos:', e);
    }
    setFetching(false);
  }

  const filteredVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || v.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddVideo = () => {
    setEditingVideo(null);
    setShowModal(true);
  };

  const handleEditVideo = (video: any) => {
    setEditingVideo(video);
    setShowModal(true);
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      const res = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVideos(videos.filter(v => v.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete video:', e);
    }
  };

  const handleToggleFeatured = async (video: any) => {
    try {
      const res = await fetch(`/api/admin/videos/${video.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !video.featured }),
      });
      if (res.ok) {
        setVideos(videos.map(v => v.id === video.id ? { ...v, featured: !v.featured } : v));
      }
    } catch (e) {
      console.error('Failed to update video:', e);
    }
  };

  const handleToggleVisible = async (video: any) => {
    try {
      const res = await fetch(`/api/admin/videos/${video.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !video.visible }),
      });
      if (res.ok) {
        setVideos(videos.map(v => v.id === video.id ? { ...v, visible: !v.visible } : v));
      }
    } catch (e) {
      console.error('Failed to update video:', e);
    }
  };

  const handleSaveVideo = async (data: any) => {
    setLoading(true);
    try {
      if (editingVideo) {
        const res = await fetch(`/api/admin/videos/${editingVideo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const updated = await res.json();
          setVideos(videos.map(v => v.id === editingVideo.id ? updated : v));
        }
      } else {
        const res = await fetch('/api/admin/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const newVideo = await res.json();
          setVideos([newVideo, ...videos]);
        }
      }
    } catch (e) {
      console.error('Failed to save video:', e);
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
          <h1 className="text-3xl font-bold tracking-tight font-display">Videos</h1>
          <p className="mt-1 text-muted-foreground">Manage your YouTube videos and featured content.</p>
        </div>
        <Button onClick={handleAddVideo}>
          <Plus className="mr-2 h-4 w-4" />
          Add Video
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
          <Input
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-0">
            {fetching ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Video</th>
                      <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                      <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Views</th>
                      <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Published</th>
                      <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order</th>
                      <th className="p-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {filteredVideos.map((video) => (
                        <motion.tr
                          key={video.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                          className="border-b border-border hover:bg-accent/50"
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`} alt="" className="h-16 w-28 rounded object-cover" />
                              <div>
                                <p className="font-medium truncate max-w-xs">{video.title}</p>
                                <p className="text-xs text-muted-foreground">{video.youtubeId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">{video.category || '—'}</span>
                          </td>
                          <td className="p-3 text-sm">{formatNumber(video.views)}</td>
                          <td className="p-3 text-sm text-muted-foreground">{video.publishedAt ? formatRelativeTime(video.publishedAt) : '—'}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleToggleFeatured(video)} className={video.featured ? 'text-yellow-500' : ''}>
                                <Star className={cn('h-4 w-4', video.featured ? 'fill-current' : '')} />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleToggleVisible(video)} className={video.visible ? '' : 'text-muted-foreground'}>
                                {video.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </Button>
                            </div>
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">{video.sortOrder}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => handleEditVideo(video)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteVideo(video.id)} className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {filteredVideos.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-muted-foreground">
                          No videos found. Add your first video!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
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
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-card border border-border p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{editingVideo ? 'Edit Video' : 'Add Video'}</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}><X className="h-5 w-5" /></Button>
              </div>
              <VideoForm onSubmit={handleSaveVideo} initialData={editingVideo} loading={loading} onCancel={() => setShowModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
