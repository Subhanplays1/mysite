'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Star, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';

const categories = ['Server', 'Hosting', 'API', 'General', 'Personal'] as const;

type Category = (typeof categories)[number];

interface Note {
  id: string;
  title: string;
  content: string;
  category: Category;
  pinned: boolean;
  updatedAt: string;
}

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Server Configuration Guide',
    content: 'Complete reference for server.properties, spigot.yml, and paper configuration. Covers performance tuning, view-distance settings, entity-activation-range, and async chunk loading for optimal server performance.',
    category: 'Server',
    pinned: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2',
    title: 'Hosting Migration Checklist',
    content: 'Step-by-step guide for migrating Minecraft servers between hosting providers. Includes panel backup, database export, DNS propagation, and zero-downtime migration strategies.',
    category: 'Hosting',
    pinned: false,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '3',
    title: 'Pterodactyl API Reference',
    content: 'REST API endpoints for server management, user creation, and egg configuration. Authentication via application API keys with rate limiting details.',
    category: 'API',
    pinned: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: '4',
    title: 'Discord Bot Commands',
    content: 'List of all slash commands for the VexPanel Discord bot. Includes server status, player list, console access, and billing notifications.',
    category: 'General',
    pinned: false,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: '5',
    title: 'Personal Dev Notes',
    content: 'Ideas for future features: resource monitor dashboard, auto-scaling, plugin marketplace integration, and custom domain support for server subdomains.',
    category: 'Personal',
    pinned: false,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
];

const categoryColors: Record<Category, string> = {
  Server: 'bg-orange-500/20 text-orange-400',
  Hosting: 'bg-blue-500/20 text-blue-400',
  API: 'bg-green-500/20 text-green-400',
  General: 'bg-purple-500/20 text-purple-400',
  Personal: 'bg-pink-500/20 text-pink-400',
};

export default function AdminNotesPage() {
  const [notes, setNotes] = React.useState<Note[]>(mockNotes);
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<Category | 'All'>('All');
  const [showModal, setShowModal] = React.useState(false);
  const [editingNote, setEditingNote] = React.useState<Note | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);
  const [formTitle, setFormTitle] = React.useState('');
  const [formContent, setFormContent] = React.useState('');
  const [formCategory, setFormCategory] = React.useState<Category>('General');
  const [formPinned, setFormPinned] = React.useState(false);

  const filteredNotes = notes
    .filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || n.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const resetForm = () => {
    setFormTitle('');
    setFormContent('');
    setFormCategory('General');
    setFormPinned(false);
  };

  const openAddModal = () => {
    setEditingNote(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormCategory(note.category);
    setFormPinned(note.pinned);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formTitle.trim()) return;

    if (editingNote) {
      setNotes(
        notes.map((n) =>
          n.id === editingNote.id
            ? { ...n, title: formTitle, content: formContent, category: formCategory, pinned: formPinned, updatedAt: new Date().toISOString() }
            : n
        )
      );
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: formTitle,
        content: formContent,
        category: formCategory,
        pinned: formPinned,
        updatedAt: new Date().toISOString(),
      };
      setNotes([newNote, ...notes]);
    }
    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    setDeleteConfirm(null);
  };

  const togglePin = (id: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Notes</h1>
          <p className="mt-1 text-muted-foreground">Quick notes, configs, and references.</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          New Note
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
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['All', ...categories] as const).map((cat) => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </motion.div>

      {filteredNotes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center py-20 text-muted-foreground"
        >
          <FileText className="h-16 w-16 mb-4 opacity-30" />
          <p className="text-lg font-medium">No notes found</p>
          <p className="text-sm">Create a new note or adjust your filters.</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <Card className="group h-full hover:shadow-md transition-all hover:border-primary/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn('text-xs font-medium px-2 py-0.5 rounded', categoryColors[note.category])}>
                            {note.category}
                          </span>
                          {note.pinned && (
                            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                          )}
                        </div>
                        <CardTitle className="text-base leading-tight truncate">{note.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{note.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{formatRelativeTime(note.updatedAt)}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => togglePin(note.id)}>
                          <Star className={cn('h-3.5 w-3.5', note.pinned ? 'fill-yellow-500 text-yellow-500' : '')} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditModal(note)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => setDeleteConfirm(note.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

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
                <h2 className="text-xl font-bold">{editingNote ? 'Edit Note' : 'New Note'}</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Note title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <Textarea
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Write your note..."
                    rows={6}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as Category)}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pinned</label>
                    <Button
                      type="button"
                      variant={formPinned ? 'default' : 'outline'}
                      className="w-full mt-0.5"
                      onClick={() => setFormPinned(!formPinned)}
                    >
                      <Star className={cn('mr-2 h-4 w-4', formPinned ? 'fill-current' : '')} />
                      {formPinned ? 'Pinned' : 'Pin Note'}
                    </Button>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="flex-1">
                    {editingNote ? 'Save Changes' : 'Create Note'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-xl bg-card border border-border p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-2">Delete Note</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete this note? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)} className="flex-1">
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
