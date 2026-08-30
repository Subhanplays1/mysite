'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save, Eye, ChevronDown, ChevronUp, Layout, BarChart3, Video, FolderKanban, Megaphone, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const sectionIcons: Record<string, React.ElementType> = {
  hero: Layout,
  about: Layout,
  stats: BarChart3,
  featuredVideos: Video,
  featuredProjects: FolderKanban,
  callToAction: Megaphone,
};

const mockSections = [
  {
    id: 'hero',
    name: 'Hero Section',
    description: 'Main landing area with title, subtitle, and call-to-action buttons',
    enabled: true,
    data: {
      title: 'SubhanPlays',
      subtitle: 'Minecraft Developer & Creator',
      description: 'Building tools and experiences for the Minecraft community.',
      primaryButton: { text: 'View Projects', url: '/projects' },
      secondaryButton: { text: 'Get in Touch', url: '/contact' },
    },
  },
  {
    id: 'about',
    name: 'About Section',
    description: 'Personal introduction and background information',
    enabled: true,
    data: {
      title: 'About Me',
      paragraphs: [
        'Full-stack developer passionate about creating innovative solutions for the Minecraft ecosystem.',
        'Building VexPanel, a modern hosting platform, and various open-source tools.',
      ],
    },
  },
  {
    id: 'stats',
    name: 'Stats Section',
    description: 'Key metrics and achievements displayed as counters',
    enabled: true,
    data: {
      stats: [
        { label: 'Projects', value: '12+' },
        { label: 'GitHub Stars', value: '500+' },
        { label: 'Years Coding', value: '6+' },
        { label: 'Happy Users', value: '10K+' },
      ],
    },
  },
  {
    id: 'featuredVideos',
    name: 'Featured Videos',
    description: 'Showcase highlighted video content from YouTube',
    enabled: true,
    data: {
      title: 'Featured Videos',
      videoIds: ['dQw4w9WgXcQ', 'oHg5SJYRHA0', '9bZkp7q19f0'],
    },
  },
  {
    id: 'featuredProjects',
    name: 'Featured Projects',
    description: 'Highlight selected projects from the portfolio',
    enabled: true,
    data: {
      title: 'Featured Projects',
      projectIds: ['1', '2'],
    },
  },
  {
    id: 'callToAction',
    name: 'Call to Action',
    description: 'Final section encouraging visitors to take action',
    enabled: true,
    data: {
      title: 'Ready to get started?',
      description: 'Check out my latest projects or get in touch to collaborate.',
      buttonText: 'View All Projects',
      buttonUrl: '/projects',
    },
  },
];

export default function AdminHomepagePage() {
  const [sections, setSections] = React.useState(mockSections);
  const [editingSection, setEditingSection] = React.useState<any>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [toast, setToast] = React.useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const [expandedSection, setExpandedSection] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState<any>({});

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleEditSection = (section: any) => {
    setEditingSection(section);
    setFormData(JSON.parse(JSON.stringify(section.data)));
    setShowModal(true);
  };

  const handleSaveSection = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setSections(sections.map(s => s.id === editingSection.id ? { ...s, data: formData } : s));
    setShowModal(false);
    setLoading(false);
    showToast('Section updated successfully');
  };

  const handleToggleSection = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleMoveSection = (id: string, direction: 'up' | 'down') => {
    const index = sections.findIndex(s => s.id === id);
    if (direction === 'up' && index > 0) {
      const newSections = [...sections];
      [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
      setSections(newSections);
    } else if (direction === 'down' && index < sections.length - 1) {
      const newSections = [...sections];
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      setSections(newSections);
    }
  };

  const renderPreview = (section: any) => {
    switch (section.id) {
      case 'hero':
        return (
          <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-6">
            <h3 className="text-xl font-bold font-display">{section.data.title}</h3>
            <p className="text-sm text-primary">{section.data.subtitle}</p>
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{section.data.description}</p>
            <div className="mt-3 flex gap-2">
              <span className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground">{section.data.primaryButton?.text}</span>
              <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">{section.data.secondaryButton?.text}</span>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="rounded-lg bg-muted/50 border border-border p-6">
            <h3 className="text-lg font-bold font-display">{section.data.title}</h3>
            {section.data.paragraphs?.map((p: string, i: number) => (
              <p key={i} className="mt-2 text-xs text-muted-foreground line-clamp-2">{p}</p>
            ))}
          </div>
        );
      case 'stats':
        return (
          <div className="rounded-lg bg-muted/50 border border-border p-4">
            <div className="grid grid-cols-2 gap-3">
              {section.data.stats?.map((stat: any, i: number) => (
                <div key={i} className="text-center">
                  <div className="text-lg font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'featuredVideos':
        return (
          <div className="rounded-lg bg-muted/50 border border-border p-4">
            <h3 className="text-sm font-bold mb-3">{section.data.title}</h3>
            <div className="grid grid-cols-3 gap-2">
              {section.data.videoIds?.slice(0, 3).map((id: string, i: number) => (
                <div key={i} className="aspect-video bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                  <Video className="h-4 w-4" />
                </div>
              ))}
            </div>
          </div>
        );
      case 'featuredProjects':
        return (
          <div className="rounded-lg bg-muted/50 border border-border p-4">
            <h3 className="text-sm font-bold mb-3">{section.data.title}</h3>
            <div className="grid grid-cols-2 gap-2">
              {section.data.projectIds?.slice(0, 2).map((id: string, i: number) => (
                <div key={i} className="p-2 bg-card rounded border border-border text-xs">
                  <span>Project {id}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'callToAction':
        return (
          <div className="rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-6 text-center">
            <h3 className="text-lg font-bold font-display">{section.data.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{section.data.description}</p>
            <span className="mt-3 inline-block text-xs px-3 py-1.5 rounded bg-primary text-primary-foreground">{section.data.buttonText}</span>
          </div>
        );
      default:
        return null;
    }
  };

  const renderFormFields = () => {
    if (!editingSection) return null;

    switch (editingSection.id) {
      case 'hero':
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Subtitle</label>
              <Input value={formData.subtitle || ''} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Primary Button Text</label>
                <Input value={formData.primaryButton?.text || ''} onChange={e => setFormData({ ...formData, primaryButton: { ...formData.primaryButton, text: e.target.value } })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Primary Button URL</label>
                <Input value={formData.primaryButton?.url || ''} onChange={e => setFormData({ ...formData, primaryButton: { ...formData.primaryButton, url: e.target.value } })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Secondary Button Text</label>
                <Input value={formData.secondaryButton?.text || ''} onChange={e => setFormData({ ...formData, secondaryButton: { ...formData.secondaryButton, text: e.target.value } })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Secondary Button URL</label>
                <Input value={formData.secondaryButton?.url || ''} onChange={e => setFormData({ ...formData, secondaryButton: { ...formData.secondaryButton, url: e.target.value } })} />
              </div>
            </div>
          </>
        );
      case 'about':
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Paragraphs (one per line)</label>
              <textarea value={formData.paragraphs?.join('\n') || ''} onChange={e => setFormData({ ...formData, paragraphs: e.target.value.split('\n').filter((p: string) => p.trim()) })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px] resize-none" />
            </div>
          </>
        );
      case 'stats':
        return (
          <>
            {(formData.stats || []).map((stat: any, i: number) => (
              <div key={i} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Label</label>
                  <Input value={stat.label} onChange={e => {
                    const newStats = [...formData.stats];
                    newStats[i] = { ...newStats[i], label: e.target.value };
                    setFormData({ ...formData, stats: newStats });
                  }} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Value</label>
                  <Input value={stat.value} onChange={e => {
                    const newStats = [...formData.stats];
                    newStats[i] = { ...newStats[i], value: e.target.value };
                    setFormData({ ...formData, stats: newStats });
                  }} />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setFormData({ ...formData, stats: [...(formData.stats || []), { label: '', value: '' }] })}>
              + Add Stat
            </Button>
          </>
        );
      case 'featuredVideos':
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Section Title</label>
              <Input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Video IDs (one per line)</label>
              <textarea value={formData.videoIds?.join('\n') || ''} onChange={e => setFormData({ ...formData, videoIds: e.target.value.split('\n').filter((v: string) => v.trim()) })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none" />
            </div>
          </>
        );
      case 'featuredProjects':
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Section Title</label>
              <Input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Project IDs (one per line)</label>
              <textarea value={formData.projectIds?.join('\n') || ''} onChange={e => setFormData({ ...formData, projectIds: e.target.value.split('\n').filter((p: string) => p.trim()) })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none" />
            </div>
          </>
        );
      case 'callToAction':
        return (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px] resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Button Text</label>
                <Input value={formData.buttonText || ''} onChange={e => setFormData({ ...formData, buttonText: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Button URL</label>
                <Input value={formData.buttonUrl || ''} onChange={e => setFormData({ ...formData, buttonUrl: e.target.value })} />
              </div>
            </div>
          </>
        );
      default:
        return null;
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
          <h1 className="text-3xl font-bold tracking-tight font-display">Homepage</h1>
          <p className="mt-1 text-muted-foreground">Edit and preview your homepage sections.</p>
        </div>
        <Button onClick={() => showToast('All sections saved')}>
          <Save className="mr-2 h-4 w-4" />
          Save All
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold font-display">Sections</h2>
          <AnimatePresence mode="popLayout">
            {sections.map((section, index) => {
              const Icon = sectionIcons[section.id] || Layout;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={cn('transition-opacity', !section.enabled && 'opacity-50')}>
                    <CardHeader className="p-3 pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <CardTitle className="text-sm">{section.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMoveSection(section.id, 'up')} disabled={index === 0}>
                            <ChevronUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMoveSection(section.id, 'down')} disabled={index === sections.length - 1}>
                            <ChevronDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleToggleSection(section.id)}>
                            {section.enabled ? <Eye className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5 text-muted-foreground" />}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-2">
                      <p className="text-xs text-muted-foreground mb-3">{section.description}</p>
                      <div className="mb-3">{renderPreview(section)}</div>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => handleEditSection(section)}>
                        <Edit className="mr-2 h-3.5 w-3.5" />
                        Edit Section
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold font-display">Live Preview</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              {sections.filter(s => s.enabled).map(section => (
                <div key={section.id}>
                  {renderPreview(section)}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

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
                <h2 className="text-xl font-bold">Edit {editingSection?.name}</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}><X className="h-5 w-5" /></Button>
              </div>

              <div className="space-y-4">
                {renderFormFields()}
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
                  <Button onClick={handleSaveSection} disabled={loading} className="flex-1">
                    {loading && <span className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg px-4 py-3 shadow-lg"
          >
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
