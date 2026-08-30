'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Grid3X3,
  List,
  Upload,
  Trash2,
  ChevronRight,
  Home,
  FileText,
  Code,
  Image,
  Archive,
  Settings,
  File,
} from 'lucide-react';
import { cn, formatBytes } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';

type FileType = 'code' | 'image' | 'archive' | 'config' | 'text' | 'folder';

interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number;
  modifiedAt: string;
}

const mockFiles: FileItem[] = [
  { id: '1', name: 'README.md', type: 'text', size: 2048, modifiedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: '2', name: 'server.properties', type: 'config', size: 1024, modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: '3', name: 'plugin-config.yml', type: 'config', size: 512, modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: '4', name: 'index.ts', type: 'code', size: 4096, modifiedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: '5', name: 'banner.png', type: 'image', size: 245760, modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { id: '6', name: 'backup-2024-01.zip', type: 'archive', size: 52428800, modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
  { id: '7', name: 'schema.prisma', type: 'code', size: 3072, modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
  { id: '8', name: 'changelog.txt', type: 'text', size: 1536, modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() },
];

const fileTypeConfig: Record<FileType, { icon: React.ElementType; color: string }> = {
  code: { icon: Code, color: 'text-blue-400' },
  image: { icon: Image, color: 'text-purple-400' },
  archive: { icon: Archive, color: 'text-yellow-400' },
  config: { icon: Settings, color: 'text-orange-400' },
  text: { icon: FileText, color: 'text-green-400' },
  folder: { icon: FileText, color: 'text-muted-foreground' },
};

const breadcrumbs = ['root', 'projects', 'vexpanel'];

export default function AdminFilesPage() {
  const [files, setFiles] = React.useState<FileItem[]>(mockFiles);
  const [search, setSearch] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
    setDeleteConfirm(null);
  };

  const handleUpload = async () => {
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const newFile: FileItem = {
      id: Date.now().toString(),
      name: `uploaded-file-${Date.now()}.txt`,
      type: 'text',
      size: Math.floor(Math.random() * 10000),
      modifiedAt: new Date().toISOString(),
    };
    setFiles([newFile, ...files]);
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Files</h1>
          <p className="mt-1 text-muted-foreground">Browse and manage project files.</p>
        </div>
        <Button onClick={handleUpload} disabled={uploading}>
          <Upload className={cn('mr-2 h-4 w-4', uploading && 'animate-pulse')} />
          {uploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb}>
              {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
              <button
                className={cn(
                  'hover:text-foreground transition-colors',
                  i === breadcrumbs.length - 1 && 'text-foreground font-medium'
                )}
              >
                {i === 0 ? <Home className="h-3.5 w-3.5 inline mr-1" /> : null}
                {crumb}
              </button>
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {filteredFiles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center py-20 text-muted-foreground"
        >
          <File className="h-16 w-16 mb-4 opacity-30" />
          <p className="text-lg font-medium">No files found</p>
          <p className="text-sm">Upload a file or adjust your search.</p>
        </motion.div>
      ) : viewMode === 'grid' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredFiles.map((file) => {
              const config = fileTypeConfig[file.type];
              const Icon = config.icon;
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <Card className="group h-full hover:shadow-md transition-all hover:border-primary/50 cursor-pointer">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className={cn('mb-3', config.color)}>
                        <Icon className="h-10 w-10" strokeWidth={1.5} />
                      </div>
                      <p className="font-medium text-sm truncate w-full">{file.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatBytes(file.size)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatRelativeTime(file.modifiedAt)}
                      </p>
                      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm(file.id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredFiles.map((file) => {
                  const config = fileTypeConfig[file.type];
                  const Icon = config.icon;
                  return (
                    <div
                      key={file.id}
                      className="group flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors"
                    >
                      <Icon className={cn('h-5 w-5 shrink-0', config.color)} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{file.name}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatBytes(file.size)}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:block">
                        {formatRelativeTime(file.modifiedAt)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setDeleteConfirm(file.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

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
              <h3 className="text-lg font-bold mb-2">Delete File</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete this file? This action cannot be undone.
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
