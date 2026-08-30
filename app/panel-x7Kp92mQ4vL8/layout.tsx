'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Menu, X, LayoutDashboard, Video, FolderKanban, MapPin, Megaphone, CheckSquare, GitBranch, FileText, StickyNote, GitCompare, Home, LayoutGrid, Menu as MenuIcon, Image, BarChart2, Users, MessageSquare, Shield, Server, Settings, Database, Activity, LogOut, Key, RotateCcw, Bell, Search, Command, Palette, Layers, Bug, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const sidebarItems = [
  { href: '/panel-x7Kp92mQ4vL8/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { group: 'CONTENT', items: [
    { href: '/panel-x7Kp92mQ4vL8/videos', label: 'Videos', icon: Video },
    { href: '/panel-x7Kp92mQ4vL8/projects', label: 'Projects', icon: FolderKanban },
    { href: '/panel-x7Kp92mQ4vL8/roadmap', label: 'Roadmap', icon: MapPin },
    { href: '/panel-x7Kp92mQ4vL8/announcements', label: 'Announcements', icon: Megaphone },
  ]},
  { group: 'PROJECTS', items: [
    { href: '/panel-x7Kp92mQ4vL8/tasks', label: 'Tasks', icon: CheckSquare },
    { href: '/panel-x7Kp92mQ4vL8/flowcharts', label: 'Flowcharts', icon: GitBranch },
    { href: '/panel-x7Kp92mQ4vL8/files', label: 'Files', icon: FileText },
    { href: '/panel-x7Kp92mQ4vL8/notes', label: 'Notes', icon: StickyNote },
    { href: '/panel-x7Kp92mQ4vL8/changelog', label: 'Changelog', icon: GitCompare },
  ]},
  { group: 'WEBSITE', items: [
    { href: '/panel-x7Kp92mQ4vL8/homepage', label: 'Homepage', icon: Home },
    { href: '/panel-x7Kp92mQ4vL8/pages', label: 'Pages', icon: LayoutGrid },
    { href: '/panel-x7Kp92mQ4vL8/sections', label: 'Sections', icon: Layers },
    { href: '/panel-x7Kp92mQ4vL8/media', label: 'Media', icon: Image },
  ]},
  { group: 'ANALYTICS', items: [
    { href: '/panel-x7Kp92mQ4vL8/analytics', label: 'Overview', icon: BarChart2 },
    { href: '/panel-x7Kp92mQ4vL8/analytics/visitors', label: 'Visitors', icon: Users },
  ]},
  { group: 'DISCORD', items: [
    { href: '/panel-x7Kp92mQ4vL8/discord/webhook', label: 'Webhook', icon: MessageSquare },
    { href: '/panel-x7Kp92mQ4vL8/discord/notifications', label: 'Notifications', icon: Bell },
  ]},
  { group: 'SECURITY', items: [
    { href: '/panel-x7Kp92mQ4vL8/security/auth', label: 'Authentication', icon: Key },
    { href: '/panel-x7Kp92mQ4vL8/security/sessions', label: 'Sessions', icon: Shield },
    { href: '/panel-x7Kp92mQ4vL8/security/audit-logs', label: 'Audit Logs', icon: Activity },
  ]},
  { group: 'SYSTEM', items: [
    { href: '/panel-x7Kp92mQ4vL8/settings', label: 'Settings', icon: Settings },
    { href: '/panel-x7Kp92mQ4vL8/backups', label: 'Backups', icon: Database },
    { href: '/panel-x7Kp92mQ4vL8/health', label: 'Health', icon: Server },
  ]},
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set(['CONTENT', 'PROJECTS', 'WEBSITE', 'ANALYTICS', 'DISCORD', 'SECURITY', 'SYSTEM']));

  const toggleGroup = (group: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        )}
        aria-label="Admin sidebar"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="font-bold tracking-tight font-display">SUBHANPLAYS</span>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3" aria-label="Admin navigation">
            <div className="space-y-1">
              <Link
                href="/panel-x7Kp92mQ4vL8/dashboard"
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === '/panel-x7Kp92mQ4vL8/dashboard'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>

              {sidebarItems.slice(1).map((section) => {
                if (!('group' in section)) return null;
                const isCollapsed = collapsedGroups.has(section.group);
                const hasActiveChild = section.items.some(item => pathname === item.href);
                
                return (
                  <div key={section.group} className="group">
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground px-2 py-1"
                      onClick={() => toggleGroup(section.group)}
                      aria-expanded={!isCollapsed}
                    >
                      <span className="flex items-center gap-2">
                        {section.group === 'CONTENT' && <Video className="h-4 w-4" />}
                        {section.group === 'PROJECTS' && <FolderKanban className="h-4 w-4" />}
                        {section.group === 'WEBSITE' && <LayoutGrid className="h-4 w-4" />}
                        {section.group === 'ANALYTICS' && <BarChart2 className="h-4 w-4" />}
                        {section.group === 'DISCORD' && <MessageSquare className="h-4 w-4" />}
                        {section.group === 'SECURITY' && <Shield className="h-4 w-4" />}
                        {section.group === 'SYSTEM' && <Server className="h-4 w-4" />}
                        {section.group}
                      </span>
                      <ChevronDown className={cn('h-4 w-4 transition-transform', isCollapsed ? '-rotate-90' : '')} />
                    </Button>
                    
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-2"
                        >
                          <div className="space-y-1">
                            {section.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                  pathname === item.href
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                )}
                              >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </nav>

          <div className="p-3 border-t border-border">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <LayoutDashboard className="h-5 w-5" />
              View Website
            </Link>
          </div>
        </div>
      </aside>

      <div className={cn('transition-all duration-300', sidebarOpen ? 'lg:ml-64' : 'lg:ml-0')}>
        <header className="sticky top-0 z-30 h-16 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="flex h-full items-center justify-between px-4 sm:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex-1 lg:hidden" />

            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <Command className="h-5 w-5 text-muted-absolute" />
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Search className="h-5 w-5" />
                </Button>
              </div>

              <Button variant="ghost" size="icon" asChild>
                <Link href="/api/admin/auth/logout" className="h-10 w-10">
                  <LogOut className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8" id="admin-main">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}