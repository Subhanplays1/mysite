'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Filter, Megaphone, X, Eye, EyeOff, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';

const announcementStyles = [
  { id: 'INFO', label: 'Info', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: '💡' },
  { id: 'WARNING', label: 'Warning', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: '⚠️' },
  { id: 'SUCCESS', label: 'Success', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '✅' },
  { id: 'ERROR', label: 'Error', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: '🚨' },
];

const mockAnnouncements = [
  {
    id: '1',
    title: 'Scheduled Maintenance - February 20th',
    message: 'We will be performing scheduled maintenance on February 20th from 2:00 AM to 6:00 AM UTC. During this time, the platform will be unavailable. We apologize for any inconvenience.',
    style: 'WARNING',
    enabled: true,
    isPublic: true,
    startDate: '2024-02-18',
    endDate: '2024-02-20',
    createdAt: '2024-02-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'New Feature: Dark Mode',
    message: 'Dark mode is now available across the entire platform! Toggle it in your profile settings or use the switch in the top navigation bar.',
    style: 'SUCCESS',
    enabled: true,
    isPublic: true,
    startDate: '2024-02-10',
    endDate: '2024-03-10',
    createdAt: '2024-02-10T08:00:00Z',
  },
  {
    id: '3',
    title: 'API Rate Limit Changes',
    message: 'Starting March 1st, API rate limits will be adjusted to ensure better performance for all users. Free tier: 60 requests/minute. Pro tier: 300 requests/minute.',
    style: 'INFO',
    enabled: true,
    isPublic: false,
    startDate: '2024-02-01',
    endDate: '2024-03-01',
    createdAt: '2024-02-01T12:00:00Z',
  },
  {
    id: '4',
    title: 'Security Vulnerability Patched',
    message: 'A critical security vulnerability has been identified and patched in version 2.1.0. All users are strongly advised to update immediately. No data breaches have been reported.',
    style: 'ERROR',
    enabled: false,
    isPublic: true,
    startDate: '2024-01-20',
    endDate: '2024-02-20',
    createdAt: '2024-01-20T06:00:00Z',
  },
];

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = React.useState(mockAnnouncements);
  const [search, setSearch] = React.useState('');
  const [styleFilter, setStyleFilter] = React.useState('all');
  const [showModal, setShowModal] = React.useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    title: '',
    message: '',
    style: 'INFO',
    enabled: true,
    isPublic: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.message.toLowerCase().includes(search.toLowerCase());
    const matchesStyle = styleFilter === 'all' || a.style === styleFilter;
    return matchesSearch && matchesStyle;
  });

  const openAddModal = () => {
    setEditingAnnouncement(null);
    setFormData({
      title: '',
      message: '',
      style: 'INFO',
      enabled: true,
      isPublic: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
    setShowModal(true);
  };

  const openEditModal = (announcement: any) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      style: announcement.style,
      enabled: announcement.enabled,
      isPublic: announcement.isPublic,
      startDate: announcement.startDate,
      endDate: announcement.endDate,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  const handleToggleEnabled = (id: string) => {
    setAnnouncements(announcements.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.message) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    if (editingAnnouncement) {
      setAnnouncements(announcements.map((a) => (a.id === editingAnnouncement.id ? { ...a, ...formData } : a)));
    } else {
      const newAnnouncement = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setAnnouncements([newAnnouncement, ...announcements]);
    }

    setShowModal(false);
    setLoading(false);
  };

  const getStyleConfig = (style: string) =>
    announcementStyles.find((s) => s.id === style) || announcementStyles[0];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Announcements</h1>
          <p className="mt-1 text-muted-foreground">Create and manage platform-wide announcements and notices.</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          New Announcement
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
          <Input placeholder="Search announcements..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2">
          {announcementStyles.map((style) => (
            <Button
              key={style.id}
              variant={styleFilter === style.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStyleFilter(styleFilter === style.id ? 'all' : style.id)}
              className={cn(styleFilter === style.id && style.color)}
            >
              {style.icon} {style.label}
            </Button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-4 md:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {filteredAnnouncements.map((announcement, index) => {
            const styleConfig = getStyleConfig(announcement.style);
            return (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
              >
                <Card className={cn('hover:shadow-lg transition-shadow relative overflow-hidden', !announcement.enabled && 'opacity-60')}>
                  <div className={cn('absolute top-0 left-0 w-full h-1', styleConfig.color.split(' ')[0])} />

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn('text-xs font-medium px-2 py-0.5 rounded border', styleConfig.color)}>
                            {styleConfig.icon} {styleConfig.label}
                          </span>
                          {!announcement.isPublic && (
                            <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground flex items-center gap-1">
                              <EyeOff className="h-3 w-3" /> Private
                            </span>
                          )}
                          {!announcement.enabled && (
                            <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">Disabled</span>
                          )}
                        </div>
                        <CardTitle className="text-base font-display truncate">{announcement.title}</CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn('h-8 w-8 shrink-0', announcement.enabled ? 'text-green-500' : 'text-muted-foreground')}
                        onClick={() => handleToggleEnabled(announcement.id)}
                        title={announcement.enabled ? 'Disable' : 'Enable'}
                      >
                        {announcement.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{announcement.message}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(announcement.createdAt)}
                        </span>
                        {announcement.startDate && announcement.endDate && (
                          <span className="flex items-center gap-1">
                            {announcement.startDate} → {announcement.endDate}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(announcement)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(announcement.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredAnnouncements.length === 0 && (
          <div className="col-span-full">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
                <Megaphone className="h-8 w-8 opacity-50" />
                No announcements found.
              </CardContent>
            </Card>
          </div>
        )}
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
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-card border border-border p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-display">
                  {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Title</label>
                  <Input
                    placeholder="Announcement title..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Message</label>
                  <textarea
                    placeholder="Announcement message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Style</label>
                  <div className="flex gap-2">
                    {announcementStyles.map((style) => (
                      <Button
                        key={style.id}
                        variant={formData.style === style.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFormData({ ...formData, style: style.id })}
                        className={cn(formData.style === style.id && style.color)}
                      >
                        {style.icon} {style.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Start Date</label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">End Date</label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium">Enabled</label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        formData.enabled ? 'bg-primary' : 'bg-muted'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          formData.enabled ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium">Public</label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        formData.isPublic ? 'bg-primary' : 'bg-muted'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          formData.isPublic ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button variant="outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={loading || !formData.title || !formData.message}>
                    {loading && <span className="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full inline-block" />}
                    {editingAnnouncement ? 'Save Changes' : 'Create Announcement'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
