'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, ChevronUp, ChevronDown, Calendar, Flag, Milestone, X, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';

const statusColors: Record<string, string> = {
  PLANNED: 'bg-gray-500/20 text-gray-400',
  IN_PROGRESS: 'bg-blue-500/20 text-blue-400',
  COMPLETED: 'bg-green-500/20 text-green-400',
};

const priorityColors: Record<string, string> = {
  LOW: 'bg-gray-500/20 text-gray-400',
  NORMAL: 'bg-blue-500/20 text-blue-400',
  HIGH: 'bg-orange-500/20 text-orange-400',
  CRITICAL: 'bg-red-500/20 text-red-400',
};

const phases = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];

const mockRoadmapItems = [
  { id: '1', title: 'Authentication System', description: 'Implement Discord OAuth2 with rotating secret keys for secure admin access', status: 'COMPLETED', priority: 'CRITICAL', phase: 'Q1 2024', projectId: '1', targetDate: '2024-01-15', sortOrder: 0 },
  { id: '2', title: 'Admin Dashboard', description: 'Build comprehensive dashboard with stats, activity feeds, and quick actions', status: 'COMPLETED', priority: 'HIGH', phase: 'Q1 2024', projectId: '1', targetDate: '2024-02-01', sortOrder: 1 },
  { id: '3', title: 'Project Management', description: 'Full project CRUD with workspace, file manager, and task tracking', status: 'IN_PROGRESS', priority: 'HIGH', phase: 'Q2 2024', projectId: '1', targetDate: '2024-04-15', sortOrder: 0 },
  { id: '4', title: 'Flowchart System', description: 'Visual project planning with React Flow and AI-powered suggestions', status: 'PLANNED', priority: 'NORMAL', phase: 'Q2 2024', projectId: '1', targetDate: '2024-05-30', sortOrder: 1 },
  { id: '5', title: 'Public Portfolio', description: 'Beautiful public-facing portfolio with project showcases and blog', status: 'PLANNED', priority: 'NORMAL', phase: 'Q3 2024', projectId: '1', targetDate: '2024-07-15', sortOrder: 0 },
  { id: '6', title: 'Mobile App', description: 'React Native companion app for monitoring projects on the go', status: 'PLANNED', priority: 'LOW', phase: 'Q4 2024', projectId: '2', targetDate: '2024-10-01', sortOrder: 0 },
];

const mockProjects = [
  { id: '1', name: 'VexPanel', icon: '🎮' },
  { id: '2', name: 'SubhanBot', icon: '🤖' },
];

export default function AdminRoadmapPage() {
  const [items, setItems] = React.useState(mockRoadmapItems);
  const [search, setSearch] = React.useState('');
  const [phaseFilter, setPhaseFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [showModal, setShowModal] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    status: 'PLANNED',
    priority: 'NORMAL',
    phase: 'Q1 2024',
    projectId: '1',
    targetDate: '',
  });

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
    const matchesPhase = phaseFilter === 'all' || item.phase === phaseFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesPhase && matchesStatus;
  });

  const groupedItems = phases.reduce((acc, phase) => {
    acc[phase] = filteredItems.filter(item => item.phase === phase).sort((a, b) => a.sortOrder - b.sortOrder);
    return acc;
  }, {} as Record<string, typeof items>);

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({ title: '', description: '', status: 'PLANNED', priority: 'NORMAL', phase: 'Q1 2024', projectId: '1', targetDate: '' });
    setShowModal(true);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setFormData({ title: item.title, description: item.description, status: item.status, priority: item.priority, phase: item.phase, projectId: item.projectId, targetDate: item.targetDate });
    setShowModal(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Delete this roadmap item?')) return;
    setItems(items.filter(i => i.id !== id));
  };

  const handleSaveItem = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));

    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? { ...i, ...formData } : i));
    } else {
      const newItem = { ...formData, id: Date.now().toString(), sortOrder: items.filter(i => i.phase === formData.phase).length };
      setItems([...items, newItem]);
    }

    setShowModal(false);
    setLoading(false);
  };

  const handleMoveItem = (itemId: string, direction: 'up' | 'down') => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const phaseItems = items.filter(i => i.phase === item.phase).sort((a, b) => a.sortOrder - b.sortOrder);
    const currentIndex = phaseItems.findIndex(i => i.id === itemId);

    if (direction === 'up' && currentIndex > 0) {
      const prevItem = phaseItems[currentIndex - 1];
      setItems(items.map(i => {
        if (i.id === itemId) return { ...i, sortOrder: prevItem.sortOrder };
        if (i.id === prevItem.id) return { ...i, sortOrder: item.sortOrder };
        return i;
      }));
    } else if (direction === 'down' && currentIndex < phaseItems.length - 1) {
      const nextItem = phaseItems[currentIndex + 1];
      setItems(items.map(i => {
        if (i.id === itemId) return { ...i, sortOrder: nextItem.sortOrder };
        if (i.id === nextItem.id) return { ...i, sortOrder: item.sortOrder };
        return i;
      }));
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Roadmap</h1>
          <p className="mt-1 text-muted-foreground">Plan and track project milestones across phases.</p>
        </div>
        <Button onClick={handleAddItem}>
          <Plus className="mr-2 h-4 w-4" />
          New Roadmap Item
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
          <Input placeholder="Search roadmap..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <select value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-40">
          <option value="all">All Phases</option>
          {phases.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-40">
          <option value="all">All Statuses</option>
          <option value="PLANNED">Planned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

        <div className="space-y-12">
          {phases.map((phase, phaseIndex) => {
            const phaseItems = groupedItems[phase] || [];
            if (phaseFilter !== 'all' && phaseFilter !== phase) return null;

            return (
              <motion.div
                key={phase}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * phaseIndex }}
              >
                <div className="flex items-center gap-4 mb-6 relative">
                  <div className="hidden md:flex h-10 w-10 rounded-full bg-primary/10 border-2 border-primary items-center justify-center z-10">
                    <Milestone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-display">{phase}</h2>
                    <p className="text-sm text-muted-foreground">{phaseItems.length} item{phaseItems.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="md:ml-14 space-y-4">
                  <AnimatePresence mode="popLayout">
                    {phaseItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="relative"
                      >
                        <div className="hidden md:block absolute -left-14 top-6 h-3 w-3 rounded-full border-2 border-primary bg-background z-10" />

                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-lg">{item.title}</h3>
                                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded', statusColors[item.status])}>{item.status.replace('_', ' ')}</span>
                                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded', priorityColors[item.priority])}>{item.priority}</span>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                                <div className="mt-3 flex items-center gap-4 flex-wrap">
                                  {item.targetDate && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Calendar className="h-3 w-3" />
                                      <span>{formatRelativeTime(item.targetDate)}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <span>{mockProjects.find(p => p.id === item.projectId)?.icon} {mockProjects.find(p => p.id === item.projectId)?.name}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMoveItem(item.id, 'up')} disabled={index === 0}>
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMoveItem(item.id, 'down')} disabled={index === phaseItems.length - 1}>
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditItem(item)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteItem(item.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {phaseItems.length === 0 && phaseFilter !== 'all' && (
                    <div className="text-center py-8 text-muted-foreground/50 text-sm">No items in this phase</div>
                  )}
                </div>
              </motion.div>
            );
          })}
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
              className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl bg-card border border-border p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{editingItem ? 'Edit Roadmap Item' : 'New Roadmap Item'}</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}><X className="h-5 w-5" /></Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Title</label>
                  <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Roadmap item title" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe this roadmap item..." className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Status</label>
                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="PLANNED">Planned</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Priority</label>
                    <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="LOW">Low</option>
                      <option value="NORMAL">Normal</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Phase</label>
                    <select value={formData.phase} onChange={e => setFormData({ ...formData, phase: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                      {phases.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Project</label>
                    <select value={formData.projectId} onChange={e => setFormData({ ...formData, projectId: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                      {mockProjects.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Target Date</label>
                  <Input type="date" value={formData.targetDate} onChange={e => setFormData({ ...formData, targetDate: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
                  <Button onClick={handleSaveItem} disabled={loading || !formData.title} className="flex-1">
                    {loading && <span className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                    {editingItem ? 'Update' : 'Create'}
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
