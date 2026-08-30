'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Star, StarOff, GripVertical, Loader2, Youtube, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime, formatNumber } from '@/lib/utils';
import { VideoForm } from '@/components/admin/video-form';

const mockVideos = [
  { id: '1', youtubeId: 'dQw4w9WgXcQ', title: 'Building a Minecraft Server from Scratch', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', category: 'Minecraft', views: 15000, publishedAt: '2024-01-15', featured: true, visible: true, sortOrder: 0 },
  { id: '2', youtubeId: 'dQw4w9WgXcQ', title: 'React vs Vue: Which is Better?', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', category: 'Coding', views: 8500, publishedAt: '2024-01-10', featured: false, visible: true, sortOrder: 1 },
  { id: '3', youtubeId: 'dQw4w9WgXcQ', title: 'Linux Server Hardening Guide', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', category: 'Linux', views: 12000, publishedAt: '2024-01-05', featured: false, visible: true, sortOrder: 2 },
];

export default function AdminVideosPage() {
  const [videos, setVideos] = React.useState(mockVideos);
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [showModal, setShowModal] = React.useState(false);
  const [editingVideo, setEditingVideo] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const categories = ['Minecraft', 'Coding', 'Linux', 'Hosting', 'Gaming', 'Technology'];

  const filteredVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || v.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddVideo = async () => {
    setEditingVideo(null);
    setShowModal(true);
  };

  const handleEditVideo = (video: any) => {
    setEditingVideo(video);
    setShowModal(true);
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    setVideos(videos.filter(v => v.id !== id));
  };

  const handleToggleFeatured = (id: string) => {
    setVideos(videos.map(v => v.id === id ? { ...v, featured: !v.featured } : v));
  };

  const handleToggleVisible = (id: string) => {
    setVideos(videos.map(v => v.id === id ? { ...v, visible: !v.visible } : v));
  };

  const handleSaveVideo = async (data: any) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    
    if (editingVideo) {
      setVideos(videos.map(v => v.id === editingVideo.id ? { ...v, ...data } : v));
    } else {
      const newVideo = { ...data, id: Date.now().toString(), views: 0, publishedAt: new Date().toISOString().split('T')[0], sortOrder: videos.length };
      setVideos([...videos, newVideo]);
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
                    {filteredVideos.map((video, index) => (
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
                            <img src={video.thumbnail} alt="" className="h-16 w-28 rounded object-cover" />
                            <div>
                              <p className="font-medium truncate max-w-xs">{video.title}</p>
                              <p className="text-xs text-muted-foreground">{video.youtubeId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">{video.category}</span>
                        </td>
                        <td className="p-3 text-sm">{formatNumber(video.views)}</td>
                        <td className="p-3 text-sm text-muted-foreground">{formatRelativeTime(video.publishedAt)}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleToggleFeatured(video.id)} className={video.featured ? 'text-yellow-500' : ''}>
                              <Star className={cn('h-4 w-4', video.featured ? 'fill-current' : '')} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleToggleVisible(video.id)} className={video.visible ? '' : 'text-muted-foreground'}>
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
          )
        )}
      </AnimatePresence>
    </div>
  );
}
