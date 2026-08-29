'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, FolderKanban, CheckSquare, Users, BarChart2, AlertTriangle, Clock, Plus, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const stats = [
  { label: 'Total Videos', value: '—', icon: Video, color: 'text-red-500', href: '/panel-x7Kp92mQ4vL8/videos' },
  { label: 'Total Projects', value: '—', icon: FolderKanban, color: 'text-blue-500', href: '/panel-x7Kp92mQ4vL8/projects' },
  { label: 'Active Projects', value: '—', icon: CheckSquare, color: 'text-green-500', href: '/panel-x7Kp92mQ4vL8/projects?status=DEVELOPMENT' },
  { label: 'Open Tasks', value: '—', icon: CheckSquare, color: 'text-yellow-500', href: '/panel-x7Kp92mQ4vL8/tasks' },
  { label: 'Visitors Today', value: '—', icon: Users, color: 'text-purple-500', href: '/panel-x7Kp92mQ4vL8/analytics/visitors' },
  { label: 'Security Alerts', value: '0', icon: AlertTriangle, color: 'text-orange-500', href: '/panel-x7Kp92mQ4vL8/security/audit-logs' },
];

const recentActivity = [
  { action: 'Video added', resource: 'New Minecraft Tutorial', time: '2 hours ago', type: 'video' },
  { action: 'Project created', resource: 'VexPanel 2.0', time: '5 hours ago', type: 'project' },
  { action: 'Task completed', resource: 'Authentication system', time: '1 day ago', type: 'task' },
  { action: 'Flowchart modified', resource: 'Hosting architecture', time: '2 days ago', type: 'flowchart' },
  { action: 'File uploaded', resource: 'README.md', time: '3 days ago', type: 'file' },
  { action: 'Website updated', resource: 'Hero section', time: '4 days ago', type: 'website' },
  { action: 'Admin login', resource: 'Session created', time: '5 days ago', type: 'login' },
];

const quickActions = [
  { label: 'Add Video', href: '/panel-x7Kp92mQ4vL8/videos/new', icon: Plus, color: 'bg-red-500/10 text-red-500' },
  { label: 'Create Project', href: '/panel-x7Kp92mQ4vL8/projects/new', icon: Plus, color: 'bg-blue-500/10 text-blue-500' },
  { label: 'New Task', href: '/panel-x7Kp92mQ4vL8/tasks/new', icon: Plus, color: 'bg-green-500/10 text-green-500' },
  { label: 'View Analytics', href: '/panel-x7Kp92mQ4vL8/analytics', icon: BarChart2, color: 'bg-purple-500/10 text-purple-500' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Welcome back. Here's an overview of your SubhanPlays platform.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/panel-x7Kp92mQ4vL8/videos/new"><Plus className="mr-2 h-4 w-4" />Add Video</Link>
          </Button>
          <Button asChild>
            <Link href="/panel-x7Kp92mQ4vL8/projects/new"><Plus className="mr-2 h-4 w-4" />New Project</Link>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight">{stat.value}</p>
                  </div>
                  <div className={cn('p-3 rounded-xl', stat.color + '/10')}>
                    <stat.icon className={cn('h-6 w-6', stat.color)} />
                  </div>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="mt-4 w-full justify-start text-xs"
                >
                  <Link href={stat.href}>View details <ExternalLink className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/panel-x7Kp92mQ4vL8/security/audit-logs">View All <ExternalLink className="ml-1 h-3 w-3" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className={cn('p-2 rounded-lg', activity.type === 'video' && 'bg-red-500/10', activity.type === 'project' && 'bg-blue-500/10', activity.type === 'task' && 'bg-green-500/10', activity.type === 'flowchart' && 'bg-purple-500/10', activity.type === 'file' && 'bg-orange-500/10', activity.type === 'website' && 'bg-pink-500/10', activity.type === 'login' && 'bg-gray-500/10')}>
                      {activity.type === 'video' && <Video className="h-4 w-4 text-red-500" />}
                      {activity.type === 'project' && <FolderKanban className="h-4 w-4 text-blue-500" />}
                      {activity.type === 'task' && <CheckSquare className="h-4 w-4 text-green-500" />}
                      {activity.type === 'flowchart' && <CheckSquare className="h-4 w-4 text-purple-500" />}
                      {activity.type === 'file' && <CheckSquare className="h-4 w-4 text-orange-500" />}
                      {activity.type === 'website' && <CheckSquare className="h-4 w-4 text-pink-500" />}
                      {activity.type === 'login' && <CheckSquare className="h-4 w-4 text-gray-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.resource}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {quickActions.map((action, i) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                    asChild
                    className={cn(
                      'relative h-24 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg',
                      action.color
                    )}
                  >
                    <Link href={action.href}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{action.label}</span>
                        <action.icon className="h-6 w-6 opacity-50" />
                      </div>
                    </Link>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Node.js', status: 'Online', icon: '●', color: 'text-green-500' },
                { label: 'Next.js', status: 'Online', icon: '●', color: 'text-green-500' },
                { label: 'PostgreSQL', status: 'Connected', icon: '●', color: 'text-green-500' },
                { label: 'Discord', status: 'Connected', icon: '●', color: 'text-green-500' },
                { label: 'YouTube API', status: 'Connected', icon: '●', color: 'text-green-500' },
                { label: 'Storage', status: 'Healthy', icon: '●', color: 'text-green-500' },
                { label: 'CPU Usage', status: '12%', icon: '⚡', color: 'text-blue-500' },
                { label: 'Memory', status: '45%', icon: '💾', color: 'text-purple-500' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <span className={cn('text-lg', item.color)}>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <span className={cn('font-mono font-medium', item.color)}>{item.status}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}