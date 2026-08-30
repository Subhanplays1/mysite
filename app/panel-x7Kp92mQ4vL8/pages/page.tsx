'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';
import { Plus, Search, Edit, Trash2, Eye, ExternalLink, X, FileText, Globe, Lock } from 'lucide-react';

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-500/20 text-gray-400',
  PUBLISHED: 'bg-green-500/20 text-green-400',
};

const mockPages = [
  { id: '1', title: 'About', slug: 'about', content: 'Welcome to SubhanPlays, a platform dedicated to Minecraft hosting, development, and community tools.', status: 'PUBLISHED', metaTitle: 'About Us - SubhanPlays', metaDescription: 'Learn more about SubhanPlays and our mission.', author: 'Subhan', updatedAt: '2026-08-25T10:00:00Z' },
  { id: '2', title: 'Contact', slug: 'contact', content: 'Get in touch with us via email or Discord.', status: 'PUBLISHED', metaTitle: 'Contact Us - SubhanPlays', metaDescription: 'Reach out to the SubhanPlays team.', author: 'Subhan', updatedAt: '2026-08-20T14:30:00Z' },
  { id: '3', title: 'Privacy Policy', slug: 'privacy-policy', content: 'Your privacy is important to us. This policy explains how we collect and use your data.', status: 'PUBLISHED', metaTitle: 'Privacy Policy - SubhanPlays', metaDescription: 'Read our privacy policy.', author: 'Subhan', updatedAt: '2026-08-15T09:00:00Z' },
  { id: '4', title: 'Terms of Service', slug: 'terms-of-service', content: 'By using our services, you agree to the following terms and conditions.', status: 'DRAFT', metaTitle: 'Terms of Service - SubhanPlays', metaDescription: 'Review our terms of service.', author: 'Subhan', updatedAt: '2026-08-10T16:45:00Z' },
  { id: '5', title: 'FAQ', slug: 'faq', content: 'Frequently asked questions about our services, billing, and support.', status: 'PUBLISHED', metaTitle: 'FAQ - SubhanPlays', metaDescription: 'Find answers to common questions.', author: 'Subhan', updatedAt: '2026-08-05T11:20:00Z' },
  { id: '6', title: 'Support', slug: 'support', content: 'Need help? Contact our support team or browse our knowledge base.', status: 'DRAFT', metaTitle: 'Support - SubhanPlays', metaDescription: 'Get help from the SubhanPlays team.', author: 'Subhan', updatedAt: '2026-08-01T08:00:00Z' },
];

export default function AdminPagesPage() {
  const [pages, setPages] = React.useState(mockPages);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [showModal, setShowModal] = React.useState(false);
  const [editingPage, setEditingPage] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const [formTitle, setFormTitle] = React.useState('');
  const [formSlug, setFormSlug] = React.useState('');
  const [formContent, setFormContent] = React.useState('');
  const [formStatus, setFormStatus] = React.useState('DRAFT');
  const [formMetaTitle, setFormMetaTitle] = React.useState('');
  const [formMetaDescription, setFormMetaDescription] = React.useState('');

  const filteredPages = pages.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormTitle('');
    setFormSlug('');
    setFormContent('');
    setFormStatus('DRAFT');
    setFormMetaTitle('');
    setFormMetaDescription('');
  };

  const handleAddPage = () => {
    setEditingPage(null);
    resetForm();
    setShowModal(true);
  };

  const handleEditPage = (page: any) => {
    setEditingPage(page);
    setFormTitle(page.title);
    setFormSlug(page.slug);
    setFormContent(page.content);
    setFormStatus(page.status);
    setFormMetaTitle(page.metaTitle);
    setFormMetaDescription(page.metaDescription);
    setShowModal(true);
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) return;
    setPages(pages.filter(p => p.id !== id));
  };

  const handleSlugFromTitle = (title: string) => {
    setFormTitle(title);
    setFormSlug(title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''));
  };

  const handleSavePage = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));

    if (editingPage) {
      setPages(pages.map(p => p.id === editingPage.id ? { ...p, title: formTitle, slug: formSlug, content: formContent, status: formStatus, metaTitle: formMetaTitle, metaDescription: formMetaDescription, updatedAt: new Date().toISOString() } : p));
    } else {
      const newPage = { id: Date.now().toString(), title: formTitle, slug: formSlug, content: formContent, status: formStatus, metaTitle: formMetaTitle, metaDescription: formMetaDescription, author: 'Subhan', updatedAt: new Date().toISOString() };
      setPages([...pages, newPage]);
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
          <h1 className="text-3xl font-bold tracking-tight font-display">Pages</h1>
          <p className="mt-1 text-muted-foreground">Manage static pages like About, Contact, and Legal pages.</p>
        </div>
        <Button onClick={handleAddPage}>
          <Plus className="mr-2 h-4 w-4" />
          New Page
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
          <Input placeholder="Search pages..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-40">
          <option value="all">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
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
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Page</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Slug</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Author</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Updated</th>
                    <th className="p-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredPages.map((page) => (
                      <motion.tr
                        key={page.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="border-b border-border hover:bg-accent/50 transition-colors"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', page.status === 'PUBLISHED' ? 'bg-green-500/10' : 'bg-gray-500/10')}>
                              <FileText className={cn('h-5 w-5', page.status === 'PUBLISHED' ? 'text-green-500' : 'text-gray-500')} />
                            </div>
                            <div>
                              <p className="font-medium truncate max-w-xs">{page.title}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-xs">{page.metaTitle}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-sm font-mono text-muted-foreground">/{page.slug}</span>
                        </td>
                        <td className="p-3">
                          <span className={cn('text-xs font-medium px-2 py-1 rounded', statusColors[page.status])}>{page.status}</span>
                        </td>
                        <td className="p-3 text-sm">{page.author}</td>
                        <td className="p-3 text-sm text-muted-foreground">{formatRelativeTime(page.updatedAt)}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" asChild>
                              <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditPage(page)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeletePage(page.id)} className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {filteredPages.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">No pages found. Create your first page!</td>
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
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-card border border-border p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{editingPage ? 'Edit Page' : 'New Page'}</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}><X className="h-5 w-5" /></Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Title</label>
                  <Input placeholder="Page title" value={formTitle} onChange={(e) => handleSlugFromTitle(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Slug</label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">/</span>
                    <Input placeholder="page-slug" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Content</label>
                  <textarea
                    className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Write your page content here..."
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Status</label>
                    <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                    </select>
                  </div>
                  <div />
                </div>
                <div className="border-t border-border pt-4 mt-4">
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">SEO Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Meta Title</label>
                      <Input placeholder="SEO title" value={formMetaTitle} onChange={(e) => setFormMetaTitle(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Meta Description</label>
                      <Input placeholder="SEO description" value={formMetaDescription} onChange={(e) => setFormMetaDescription(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button onClick={handleSavePage} disabled={loading || !formTitle}>
                    {loading ? 'Saving...' : editingPage ? 'Update Page' : 'Create Page'}
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
