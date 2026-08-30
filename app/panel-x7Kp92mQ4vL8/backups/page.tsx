'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Database,
  Download,
  Trash2,
  RefreshCw,
  Clock,
  HardDrive,
  ArrowUpCircle,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Settings,
  RotateCcw,
  X,
  FileDown,
  Shield,
  Calendar,
  FolderArchive,
} from 'lucide-react';
import { cn, formatRelativeTime, formatBytes } from '@/lib/utils';

type BackupStatus = 'SUCCESS' | 'FAILED' | 'IN_PROGRESS';
type BackupType = 'manual' | 'auto';

const initialBackups = [
  { id: 'bkp_001', timestamp: '2026-08-30T10:00:00Z', size: 157286400, type: 'auto' as BackupType, status: 'SUCCESS' as BackupStatus, databases: ['main', 'analytics'], files: 342 },
  { id: 'bkp_002', timestamp: '2026-08-29T22:30:00Z', size: 155648000, type: 'manual' as BackupType, status: 'SUCCESS' as BackupStatus, databases: ['main'], files: 338 },
  { id: 'bkp_003', timestamp: '2026-08-29T10:00:00Z', size: 154599424, type: 'auto' as BackupType, status: 'SUCCESS' as BackupStatus, databases: ['main', 'analytics'], files: 335 },
  { id: 'bkp_004', timestamp: '2026-08-28T10:00:00Z', size: 153124864, type: 'auto' as BackupType, status: 'FAILED' as BackupStatus, databases: ['main'], files: 330 },
  { id: 'bkp_005', timestamp: '2026-08-27T10:00:00Z', size: 152371200, type: 'auto' as BackupType, status: 'SUCCESS' as BackupStatus, databases: ['main', 'analytics'], files: 328 },
  { id: 'bkp_006', timestamp: '2026-08-26T14:15:00Z', size: 150995968, type: 'manual' as BackupType, status: 'SUCCESS' as BackupStatus, databases: ['main'], files: 325 },
];

const STATUS_CONFIG: Record<BackupStatus, { color: string; icon: typeof CheckCircle; label: string }> = {
  SUCCESS: { color: 'text-green-400', icon: CheckCircle, label: 'Success' },
  FAILED: { color: 'text-red-400', icon: XCircle, label: 'Failed' },
  IN_PROGRESS: { color: 'text-amber-400', icon: Loader2, label: 'In Progress' },
};

export default function AdminBackupsPage() {
  const [backups, setBackups] = React.useState(initialBackups);
  const [autoBackup, setAutoBackup] = React.useState(true);
  const [retentionCount, setRetentionCount] = React.useState('10');
  const [creatingBackup, setCreatingBackup] = React.useState(false);
  const [restoreConfirm, setRestoreConfirm] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [restoringId, setRestoringId] = React.useState<string | null>(null);
  const [showSettings, setShowSettings] = React.useState(false);

  const lastBackup = backups[0];
  const totalBackups = backups.length;
  const totalSize = backups.reduce((sum, b) => sum + b.size, 0);

  const handleCreateBackup = async () => {
    setCreatingBackup(true);
    await new Promise((r) => setTimeout(r, 2000));
    const newBackup = {
      id: `bkp_${Date.now()}`,
      timestamp: new Date().toISOString(),
      size: Math.floor(Math.random() * 10000000) + 150000000,
      type: 'manual' as BackupType,
      status: 'SUCCESS' as BackupStatus,
      databases: ['main', 'analytics'],
      files: 342 + Math.floor(Math.random() * 10),
    };
    setBackups((prev) => [newBackup, ...prev]);
    setCreatingBackup(false);
  };

  const handleDeleteBackup = async (id: string) => {
    setDeletingId(id);
    await new Promise((r) => setTimeout(r, 800));
    setBackups((prev) => prev.filter((b) => b.id !== id));
    setDeletingId(null);
  };

  const handleRestore = async (id: string) => {
    setRestoringId(id);
    await new Promise((r) => setTimeout(r, 2000));
    setRestoringId(null);
    setRestoreConfirm(null);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10">
              <Database className="h-7 w-7 text-blue-500" />
            </div>
            Backups
          </h1>
          <p className="mt-1 text-muted-foreground">Manage database backups and restoration.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button onClick={handleCreateBackup} disabled={creatingBackup}>
            {creatingBackup ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Create Backup
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          {
            label: 'Last Backup',
            value: lastBackup ? formatRelativeTime(lastBackup.timestamp) : 'Never',
            icon: Clock,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
          },
          {
            label: 'Total Backups',
            value: totalBackups.toString(),
            icon: FolderArchive,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
          },
          {
            label: 'Total Size',
            value: formatBytes(totalSize),
            icon: HardDrive,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
          },
          {
            label: 'Auto-Backup',
            value: autoBackup ? 'Active' : 'Disabled',
            icon: ArrowUpCircle,
            color: autoBackup ? 'text-green-500' : 'text-gray-500',
            bg: autoBackup ? 'bg-green-500/10' : 'bg-gray-500/10',
          },
        ].map((stat, i) => (
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
                    <p className="mt-2 text-2xl font-bold tracking-tight">{stat.value}</p>
                  </div>
                  <div className={cn('p-3 rounded-xl', stat.bg)}>
                    <stat.icon className={cn('h-6 w-6', stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  Backup Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Automatic Backups</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">Create a backup every 24 hours automatically</p>
                    </div>
                    <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Backup Retention</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">Maximum number of backups to keep</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        value={retentionCount}
                        onChange={(e) => setRetentionCount(e.target.value)}
                        className="w-20 text-center"
                      />
                      <span className="text-sm text-muted-foreground">backups</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <div>
                        <p className="text-sm font-medium">Backup Schedule</p>
                        <p className="text-xs text-muted-foreground">Next auto-backup in 14 hours</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                      Daily at 10:00 UTC
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Backup History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <AnimatePresence>
                {backups.map((backup, i) => {
                  const statusConfig = STATUS_CONFIG[backup.status];
                  const StatusIcon = statusConfig.icon;
                  return (
                    <motion.div
                      key={backup.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className={cn(
                        'flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-colors hover:bg-accent/30',
                        backup.status === 'FAILED' ? 'border-red-500/20 bg-red-500/5' : 'border-border'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn('p-2.5 rounded-lg', backup.type === 'manual' ? 'bg-blue-500/10' : 'bg-green-500/10')}>
                          {backup.type === 'manual' ? (
                            <HardDrive className="h-5 w-5 text-blue-500" />
                          ) : (
                            <ArrowUpCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{backup.id.toUpperCase()}</p>
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[10px] px-1.5 py-0',
                                backup.type === 'manual'
                                  ? 'text-blue-400 border-blue-500/30'
                                  : 'text-green-400 border-green-500/30'
                              )}
                            >
                              {backup.type === 'manual' ? 'MANUAL' : 'AUTO'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatRelativeTime(backup.timestamp)}
                            </span>
                            <span className="flex items-center gap-1">
                              <HardDrive className="h-3 w-3" />
                              {formatBytes(backup.size)}
                            </span>
                            <span>{backup.files} files</span>
                            <span>{backup.databases.length} database{backup.databases.length !== 1 ? 's' : ''}</span>
                          </div>
                          {backup.status === 'FAILED' && (
                            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              Backup failed - partial data may be corrupted
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 sm:mt-0">
                        <span className={cn('flex items-center gap-1.5 text-xs font-medium mr-2', statusConfig.color)}>
                          <StatusIcon className={cn('h-3.5 w-3.5', backup.status === 'IN_PROGRESS' && 'animate-spin')} />
                          {statusConfig.label}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRestoreConfirm(backup.id)}
                          disabled={backup.status !== 'SUCCESS' || restoringId === backup.id}
                        >
                          {restoringId === backup.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <RotateCcw className="h-3.5 w-3.5" />
                          )}
                          Restore
                        </Button>
                        <Button variant="outline" size="sm" disabled={backup.status !== 'SUCCESS'}>
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteBackup(backup.id)}
                          disabled={deletingId === backup.id}
                        >
                          {deletingId === backup.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {backups.length === 0 && (
                <div className="text-center py-12 text-muted-foreground/50">
                  <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No backups yet</p>
                  <p className="text-xs mt-1">Create your first backup to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {restoreConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setRestoreConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-xl bg-card border border-border p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <RotateCcw className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Restore Backup</h2>
                  <p className="text-sm text-muted-foreground">This will overwrite current data</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                You are about to restore backup <span className="font-mono font-medium text-foreground">{restoreConfirm?.toUpperCase()}</span>.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                This will replace all current database contents and files with the data from this backup. This action cannot be undone.
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setRestoreConfirm(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleRestore(restoreConfirm)}
                  disabled={restoringId === restoreConfirm}
                >
                  {restoringId === restoreConfirm ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RotateCcw className="mr-2 h-4 w-4" />
                  )}
                  Confirm Restore
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
