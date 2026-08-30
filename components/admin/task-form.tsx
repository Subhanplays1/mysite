'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, X } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  loading?: boolean;
  onCancel: () => void;
}

const columns = [
  { id: 'TODO', label: 'TODO' },
  { id: 'IN_PROGRESS', label: 'IN PROGRESS' },
  { id: 'REVIEW', label: 'REVIEW' },
  { id: 'TESTING', label: 'TESTING' },
  { id: 'DONE', label: 'DONE' },
];

const priorities = [
  { id: 'LOW', label: 'Low' },
  { id: 'NORMAL', label: 'Normal' },
  { id: 'HIGH', label: 'High' },
  { id: 'CRITICAL', label: 'Critical' },
];

export function TaskForm({ onSubmit, initialData, loading, onCancel }: TaskFormProps) {
  const [formData, setFormData] = React.useState({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    status: initialData?.status ?? 'TODO',
    priority: initialData?.priority ?? 'NORMAL',
    tags: initialData?.tags?.join(', ') ?? '',
    deadline: initialData?.deadline ? initialData.deadline.split('T')[0] : '',
    dependencies: initialData?.dependencies?.join(', ') ?? '',
    projectId: initialData?.projectId ?? '1',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      dependencies: formData.dependencies.split(',').map((t: string) => t.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} placeholder="Task title" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            {columns.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select value={formData.priority} onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value }))} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            {priorities.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Deadline</label>
          <Input type="date" value={formData.deadline} onChange={e => setFormData(prev => ({ ...prev, deadline: e.target.value }))} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Project</label>
          <select value={formData.projectId} onChange={e => setFormData(prev => ({ ...prev, projectId: e.target.value }))} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="1">VexPanel</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
        <Input value={formData.tags} onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))} placeholder="auth, security, backend" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Dependencies (task IDs, comma separated)</label>
        <Input value={formData.dependencies} onChange={e => setFormData(prev => ({ ...prev, dependencies: e.target.value }))} placeholder="1, 2" />
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}{initialData ? 'Save Changes' : 'Create Task'}</Button>
      </div>
    </form>
  );
}