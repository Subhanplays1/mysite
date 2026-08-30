'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Filter, Tag, X, GitBranch, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';

const entryTypes = [
  { id: 'ADDED', label: 'Added', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { id: 'FIXED', label: 'Fixed', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 'CHANGED', label: 'Changed', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'REMOVED', label: 'Removed', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
];

const mockEntries = [
  {
    id: '1',
    version: 'v2.1.0',
    date: '2024-02-15',
    public: true,
    changes: [
      { type: 'ADDED', description: 'Dark mode toggle for admin dashboard' },
      { type: 'ADDED', description: 'Real-time notifications system with WebSocket support' },
      { type: 'CHANGED', description: 'Upgraded React to v18.3 and Next.js to v14.1' },
      { type: 'FIXED', description: 'Memory leak in WebSocket connection handler' },
    ],
  },
  {
    id: '2',
    version: 'v2.0.0',
    date: '2024-02-01',
    public: true,
    changes: [
      { type: 'ADDED', description: 'Complete admin panel rewrite with new UI' },
      { type: 'ADDED', description: 'Project workspace with Monaco code editor' },
      { type: 'ADDED', description: 'Kanban board for task management' },
      { type: 'REMOVED', description: 'Legacy jQuery-based admin interface' },
    ],
  },
  {
    id: '3',
    version: 'v1.5.0',
    date: '2024-01-15',
    public: true,
    changes: [
      { type: 'ADDED', description: 'YouTube video embed with auto-sync' },
      { type: 'CHANGED', description: 'Redesigned navigation sidebar with collapsible sections' },
      { type: 'FIXED', description: 'Login session expiration not refreshing properly' },
    ],
  },
  {
    id: '4',
    version: 'v1.4.0',
    date: '2024-01-01',
    public: true,
    changes: [
      { type: 'ADDED', description: 'Discord OAuth2 integration' },
      { type: 'ADDED', description: 'Profile page with activity feed' },
      { type: 'FIXED', description: 'CSS layout issues on mobile devices' },
    ],
  },
  {
    id: '5',
    version: 'v1.3.1',
    date: '2023-12-15',
    public: false,
    changes: [
      { type: 'FIXED', description: 'Database connection pool exhaustion under high load' },
      { type: 'FIXED', description: 'Rate limiter not resetting after window expires' },
    ],
  },
  {
    id: '6',
    version: 'v1.3.0',
    date: '2023-12-01',
    public: true,
    changes: [
      { type: 'ADDED', description: 'REST API with authentication and rate limiting' },
      { type: 'ADDED', description: 'Webhook support for external integrations' },
      { type: 'CHANGED', description: 'Migrated from MongoDB to PostgreSQL' },
      { type: 'REMOVED', description: 'Deprecated v1 API endpoints' },
    ],
  },
];

export default function AdminChangelogPage() {
  const [entries, setEntries] = React.useState(mockEntries);
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [showModal, setShowModal] = React.useState(false);
  const [editingEntry, setEditingEntry] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    version: '',
    date: new Date().toISOString().split('T')[0],
    public: true,
    changes: [{ type: 'ADDED', description: '' }] as { type: string; description: string }[],
  });

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.version.toLowerCase().includes(search.toLowerCase()) ||
      entry.changes.some((c) => c.description.toLowerCase().includes(search.toLowerCase()));
    const matchesType =
      typeFilter === 'all' || entry.changes.some((c) => c.type === typeFilter);
    return matchesSearch && matchesType;
  });

  const openAddModal = () => {
    setEditingEntry(null);
    setFormData({
      version: '',
      date: new Date().toISOString().split('T')[0],
      public: true,
      changes: [{ type: 'ADDED', description: '' }],
    });
    setShowModal(true);
  };

  const openEditModal = (entry: any) => {
    setEditingEntry(entry);
    setFormData({
      version: entry.version,
      date: entry.date,
      public: entry.public,
      changes: entry.changes.map((c: any) => ({ ...c })),
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this changelog entry?')) return;
    setEntries(entries.filter((e) => e.id !== id));
  };

  const addChangeRow = () => {
    setFormData({ ...formData, changes: [...formData.changes, { type: 'ADDED', description: '' }] });
  };

  const removeChangeRow = (index: number) => {
    if (formData.changes.length <= 1) return;
    setFormData({ ...formData, changes: formData.changes.filter((_, i) => i !== index) });
  };

  const updateChange = (index: number, field: string, value: string) => {
    const updated = formData.changes.map((c, i) => (i === index ? { ...c, [field]: value } : c));
    setFormData({ ...formData, changes: updated });
  };

  const handleSave = async () => {
    if (!formData.version || formData.changes.some((c) => !c.description)) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    if (editingEntry) {
      setEntries(entries.map((e) => (e.id === editingEntry.id ? { ...e, ...formData } : e)));
    } else {
      const newEntry = { ...formData, id: Date.now().toString() };
      setEntries([newEntry, ...entries]);
    }

    setShowModal(false);
    setLoading(false);
  };

  const getTypeColor = (type: string) =>
    entryTypes.find((t) => t.id === type)?.color || 'bg-gray-500/20 text-gray-400';

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Changelog</h1>
          <p className="mt-1 text-muted-foreground">Track and manage version history and release notes.</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          New Entry
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
          <Input placeholder="Search changelog..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2">
          {entryTypes.map((type) => (
            <Button
              key={type.id}
              variant={typeFilter === type.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter(typeFilter === type.id ? 'all' : type.id)}
              className={cn(typeFilter === type.id && type.color)}
            >
              <Tag className="mr-1 h-3 w-3" />
              {type.label}
            </Button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative pl-16"
              >
                <div className="absolute left-5 top-6 h-6 w-6 rounded-full bg-primary border-4 border-background z-10" />

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg font-display">{entry.version}</CardTitle>
                        {!entry.public && (
                          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">Private</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatRelativeTime(entry.date)}
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(entry)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(entry.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {entry.changes.map((change, ci) => (
                        <div key={ci} className="flex items-start gap-3">
                          <span className={cn('text-xs font-medium px-2 py-0.5 rounded border mt-0.5 shrink-0', getTypeColor(change.type))}>
                            {change.type}
                          </span>
                          <p className="text-sm text-muted-foreground">{change.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredEntries.length === 0 && (
            <div className="relative pl-16">
              <div className="absolute left-5 top-6 h-6 w-6 rounded-full bg-muted border-4 border-background z-10" />
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">No changelog entries found.</CardContent>
              </Card>
            </div>
          )}
        </div>
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
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-display">
                  {editingEntry ? 'Edit Changelog Entry' : 'New Changelog Entry'}
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Version</label>
                    <Input
                      placeholder="v2.1.0"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Date</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">Public</label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, public: !formData.public })}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      formData.public ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        formData.public ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium">Changes</label>
                    <Button variant="outline" size="sm" onClick={addChangeRow}>
                      <Plus className="mr-1 h-3 w-3" /> Add Change
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {formData.changes.map((change, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <select
                          value={change.type}
                          onChange={(e) => updateChange(index, 'type', e.target.value)}
                          className="h-10 rounded-md border border-input bg-background px-3 text-sm w-32"
                        >
                          {entryTypes.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                        <Input
                          placeholder="Description..."
                          value={change.description}
                          onChange={(e) => updateChange(index, 'description', e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 shrink-0 text-destructive"
                          onClick={() => removeChangeRow(index)}
                          disabled={formData.changes.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button variant="outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={loading}>
                    {loading && <span className="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full inline-block" />}
                    {editingEntry ? 'Save Changes' : 'Create Entry'}
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
