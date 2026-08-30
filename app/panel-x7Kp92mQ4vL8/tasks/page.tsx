'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, GripVertical, Loader2, Filter, Calendar, Flag, Tag, MoreHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';
import { TaskForm } from '@/components/admin/task-form';

const columns = [
  { id: 'TODO', label: 'TODO', color: 'bg-gray-500/20 text-gray-400' },
  { id: 'IN_PROGRESS', label: 'IN PROGRESS', color: 'bg-blue-500/20 text-blue-400' },
  { id: 'REVIEW', label: 'REVIEW', color: 'bg-purple-500/20 text-purple-400' },
  { id: 'TESTING', label: 'TESTING', color: 'bg-yellow-500/20 text-yellow-400' },
  { id: 'DONE', label: 'DONE', color: 'bg-green-500/20 text-green-400' },
];

const priorities = [
  { id: 'LOW', label: 'Low', color: 'bg-gray-500/20 text-gray-400' },
  { id: 'NORMAL', label: 'Normal', color: 'bg-blue-500/20 text-blue-400' },
  { id: 'HIGH', label: 'High', color: 'bg-orange-500/20 text-orange-400' },
  { id: 'CRITICAL', label: 'Critical', color: 'bg-red-500/20 text-red-400' },
];

const mockTasks = [
  { id: '1', title: 'Design authentication system', description: 'Create rotating secret key auth with Discord integration', status: 'DONE', priority: 'HIGH', tags: ['auth', 'security'], deadline: '2024-01-20', dependencies: [], projectId: '1', sortOrder: 0 },
  { id: '2', title: 'Build admin dashboard', description: 'Create dashboard with stats, activity feed, quick actions', status: 'IN_PROGRESS', priority: 'HIGH', tags: ['ui', 'dashboard'], deadline: '2024-01-25', dependencies: ['1'], projectId: '1', sortOrder: 0 },
  { id: '3', title: 'Implement file manager', description: 'Project file manager with Monaco Editor integration', status: 'TODO', priority: 'NORMAL', tags: ['files', 'editor'], deadline: '2024-02-01', dependencies: ['2'], projectId: '1', sortOrder: 1 },
  { id: '4', title: 'Create React Flow flowchart', description: 'Visual project planning with AI assistant', status: 'TODO', priority: 'HIGH', tags: ['flowchart', 'ai'], deadline: '2024-02-10', dependencies: [], projectId: '1', sortOrder: 2 },
  { id: '5', title: 'Write API documentation', description: 'Document all admin and public API endpoints', status: 'TODO', priority: 'LOW', tags: ['docs'], deadline: '2024-02-15', dependencies: ['2'], projectId: '1', sortOrder: 3 },
  { id: '6', title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions for build and deploy', status: 'REVIEW', priority: 'NORMAL', tags: ['devops', 'ci'], deadline: '2024-01-30', dependencies: ['1'], projectId: '1', sortOrder: 0 },
];

export default function AdminTasksPage() {
  const [tasks, setTasks] = React.useState(mockTasks);
  const [search, setSearch] = React.useState('');
  const [projectFilter, setProjectFilter] = React.useState('all');
  const [showModal, setShowModal] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase());
    const matchesProject = projectFilter === 'all' || t.projectId === projectFilter;
    return matchesSearch && matchesProject;
  });

  const getColumnTasks = (columnId: string) => filteredTasks.filter(t => t.status === columnId).sort((a, b) => a.sortOrder - b.sortOrder);

  const handleAddTask = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleMoveTask = (taskId: string, newStatus: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleSaveTask = async (data: any) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...data } : t));
    } else {
      const newTask = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setTasks([...tasks, newTask]);
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
          <h1 className="text-3xl font-bold tracking-tight font-display">Tasks</h1>
          <p className="mt-1 text-muted-foreground">Kanban board for managing project tasks across all projects.</p>
        </div>
        <Button onClick={handleAddTask}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
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
          <Input placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-48">
          <option value="all">All Projects</option>
          <option value="1">VexPanel</option>
        </select>
        <Button variant="outline"><Filter className="mr-2 h-4 w-4" />Filters</Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-4 overflow-x-auto pb-4"
      >
        {columns.map((column) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex-shrink-0 w-80"
          >
            <Card>
              <CardHeader className="p-3 pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn('text-xs font-medium px-2 py-1 rounded', column.color)}>{column.label}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{getColumnTasks(column.id).length}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => { setEditingTask({ status: column.id }); setShowModal(true); }} className="h-6 w-6"><Plus className="h-3.5 w-3.5" /></Button>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div
                  className="min-h-[400px] space-y-2"
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault();
                    const taskId = e.dataTransfer.getData('task-id');
                    if (taskId) handleMoveTask(taskId, column.id);
                  }}
                >
                  <AnimatePresence mode="popLayout">
                    {getColumnTasks(column.id).map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="group relative bg-card border border-border rounded-lg p-3 hover:shadow-md transition-shadow"
                        draggable
                        onDragStart={e => e.dataTransfer.setData('task-id', task.id)}
                        onDragEnd={e => e.preventDefault()}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <GripVertical className="text-muted-foreground/50 cursor-grab active:cursor-grabbing mt-0.5" />
                          <div className="flex items-center gap-1">
                            {task.priority === 'CRITICAL' && <Flag className="h-3 w-3 text-red-500" title="Critical" />}
                            {task.priority === 'HIGH' && <Flag className="h-3 w-3 text-orange-500" title="High" />}
                          </div>
                        </div>
                        <h4 className="mt-1 font-medium text-sm">{task.title}</h4>
                        {task.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{task.description}</p>}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {task.tags.slice(0, 3).map(tag => <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">#{tag}</span>)}
                        </div>
                        {task.deadline && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatRelativeTime(task.deadline)}</span>
                          </div>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditTask(task)}><Edit className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDeleteTask(task.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {getColumnTasks(column.id).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground/50 text-sm">No tasks</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
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
                <h2 className="text-xl font-bold">{editingTask ? 'Edit Task' : 'New Task'}</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}><X className="h-5 w-5" /></Button>
              </div>
              <TaskForm onSubmit={handleSaveTask} initialData={editingTask} loading={loading} onCancel={() => setShowModal(false)} />
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}