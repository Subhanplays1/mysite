import { join, resolve, relative, dirname } from 'path';
import { mkdir, writeFile, readFile, unlink, readdir, stat, rename, cp, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { prisma } from './database';
import { formatBytes } from './utils';

const STORAGE_ROOT = process.env.STORAGE_PATH ?? './storage';
const PROJECTS_STORAGE = join(STORAGE_ROOT, 'projects');
const MEDIA_STORAGE = join(STORAGE_ROOT, 'media');
const BACKUPS_STORAGE = process.env.BACKUP_PATH ?? './backups';

export async function ensureStorageDirectories(): Promise<void> {
  await mkdir(PROJECTS_STORAGE, { recursive: true });
  await mkdir(MEDIA_STORAGE, { recursive: true });
  await mkdir(BACKUPS_STORAGE, { recursive: true });
}

function sanitizePath(base: string, target: string): string {
  const resolvedBase = resolve(base);
  const resolvedTarget = resolve(target);
  
  if (!resolvedTarget.startsWith(resolvedBase)) {
    throw new Error('Path traversal attempt detected');
  }
  
  return resolvedTarget;
}

export async function getProjectStoragePath(projectId: string): Promise<string> {
  const projectPath = join(PROJECTS_STORAGE, projectId);
  await mkdir(projectPath, { recursive: true });
  return sanitizePath(PROJECTS_STORAGE, projectPath);
}

export async function listProjectFiles(projectId: string, folderPath = ''): Promise<Array<{
  name: string;
  path: string;
  type: 'FILE' | 'FOLDER';
  size: number;
  mimeType?: string;
  modified: Date;
}>> {
  const basePath = await getProjectStoragePath(projectId);
  const targetPath = folderPath ? join(basePath, folderPath) : basePath;
  
  const sanitizedPath = sanitizePath(basePath, targetPath);
  
  if (!existsSync(sanitizedPath)) {
    await mkdir(sanitizedPath, { recursive: true });
    return [];
  }

  const entries = await readdir(sanitizedPath, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = join(sanitizedPath, entry.name);
    const stats = await stat(fullPath);
    const relPath = relative(basePath, fullPath);
    
    return {
      name: entry.name,
      path: relPath,
      type: entry.isDirectory() ? 'FOLDER' : 'FILE',
      size: stats.size,
      mimeType: entry.isFile() ? getMimeType(entry.name) : undefined,
      modified: stats.mtime,
    };
  }));

  return files.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'FOLDER' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export async function createProjectFile(
  projectId: string,
  filePath: string,
  content: string | Buffer,
  isFolder = false
): Promise<void> {
  const basePath = await getProjectStoragePath(projectId);
  const fullPath = sanitizePath(basePath, join(basePath, filePath));
  
  if (isFolder) {
    await mkdir(fullPath, { recursive: true });
  } else {
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, content);
  }

  const stats = await stat(fullPath);
  const relPath = relative(basePath, fullPath);
  
  await prisma.projectFile.create({
    data: {
      projectId,
      name: filePath.split('/').pop() ?? '',
      path: relPath,
      type: isFolder ? 'FOLDER' : 'FILE',
      size: BigInt(stats.size),
      mimeType: isFolder ? undefined : getMimeType(filePath),
      content: isFolder ? null : content.toString(),
    },
  });
}

export async function readProjectFile(projectId: string, filePath: string): Promise<string | null> {
  const basePath = await getProjectStoragePath(projectId);
  const fullPath = sanitizePath(basePath, join(basePath, filePath));
  
  if (!existsSync(fullPath)) return null;
  
  const stats = await stat(fullPath);
  if (stats.isDirectory()) return null;
  
  return readFile(fullPath, 'utf-8');
}

export async function updateProjectFile(
  projectId: string,
  filePath: string,
  content: string
): Promise<void> {
  const basePath = await getProjectStoragePath(projectId);
  const fullPath = sanitizePath(basePath, join(basePath, filePath));
  
  if (!existsSync(fullPath)) throw new Error('File not found');
  
  const stats = await stat(fullPath);
  if (stats.isDirectory()) throw new Error('Cannot write to directory');
  
  const file = await prisma.projectFile.findFirst({
    where: { projectId, path: filePath },
  });
  
  if (file) {
    await prisma.projectFileVersion.create({
      data: {
        fileId: file.id,
        content: file.content ?? '',
        version: file.version,
        message: 'Auto-save',
      },
    });
    
    await prisma.projectFile.update({
      where: { id: file.id },
      data: {
        content,
        version: { increment: 1 },
        size: BigInt(Buffer.byteLength(content, 'utf-8')),
        updatedAt: new Date(),
      },
    });
  }
  
  await writeFile(fullPath, content);
}

export async function deleteProjectFile(projectId: string, filePath: string): Promise<void> {
  const basePath = await getProjectStoragePath(projectId);
  const fullPath = sanitizePath(basePath, join(basePath, filePath));
  
  if (!existsSync(fullPath)) return;
  
  await rm(fullPath, { recursive: true, force: true });
  
  await prisma.projectFile.deleteMany({
    where: { projectId, path: { startsWith: filePath } },
  });
}

export async function renameProjectFile(
  projectId: string,
  oldPath: string,
  newPath: string
): Promise<void> {
  const basePath = await getProjectStoragePath(projectId);
  const oldFullPath = sanitizePath(basePath, join(basePath, oldPath));
  const newFullPath = sanitizePath(basePath, join(basePath, newPath));
  
  if (!existsSync(oldFullPath)) throw new Error('File not found');
  
  await mkdir(dirname(newFullPath), { recursive: true });
  await rename(oldFullPath, newFullPath);
  
  const stats = await stat(newFullPath);
  const relPath = relative(basePath, newFullPath);
  
  await prisma.projectFile.updateMany({
    where: { projectId, path: { startsWith: oldPath } },
    data: { path: { set: relPath } },
  });
}

export async function copyProjectFile(
  projectId: string,
  sourcePath: string,
  destPath: string
): Promise<void> {
  const basePath = await getProjectStoragePath(projectId);
  const sourceFullPath = sanitizePath(basePath, join(basePath, sourcePath));
  const destFullPath = sanitizePath(basePath, join(basePath, destPath));
  
  if (!existsSync(sourceFullPath)) throw new Error('Source not found');
  
  await mkdir(dirname(destFullPath), { recursive: true });
  await cp(sourceFullPath, destFullPath, { recursive: true });
  
  await syncProjectFilesFromDisk(projectId);
}

export async function uploadProjectFile(
  projectId: string,
  folderPath: string,
  file: File
): Promise<void> {
  const basePath = await getProjectStoragePath(projectId);
  const targetPath = folderPath ? join(basePath, folderPath, file.name) : join(basePath, file.name);
  const sanitizedPath = sanitizePath(basePath, targetPath);
  
  await mkdir(dirname(sanitizedPath), { recursive: true });
  
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(sanitizedPath, buffer);
  
  const stats = await stat(sanitizedPath);
  const relPath = relative(basePath, sanitizedPath);
  
  await prisma.projectFile.create({
    data: {
      projectId,
      name: file.name,
      path: relPath,
      type: 'FILE',
      size: BigInt(stats.size),
      mimeType: file.type || getMimeType(file.name),
      content: isTextFile(file.name) ? buffer.toString('utf-8') : null,
    },
  });
}

export async function downloadProjectFile(projectId: string, filePath: string): Promise<Buffer | null> {
  const basePath = await getProjectStoragePath(projectId);
  const fullPath = sanitizePath(basePath, join(basePath, filePath));
  
  if (!existsSync(fullPath)) return null;
  
  const stats = await stat(fullPath);
  if (stats.isDirectory()) return null;
  
  return readFile(fullPath);
}

async function syncProjectFilesFromDisk(projectId: string): Promise<void> {
  const basePath = await getProjectStoragePath(projectId);
  
  async function scanDir(currentPath: string, parentPath = ''): Promise<void> {
    const entries = await readdir(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(currentPath, entry.name);
      const relPath = parentPath ? join(parentPath, entry.name) : entry.name;
      const stats = await stat(fullPath);
      
      const existing = await prisma.projectFile.findFirst({
        where: { projectId, path: relPath },
      });
      
      if (!existing) {
        await prisma.projectFile.create({
          data: {
            projectId,
            name: entry.name,
            path: relPath,
            type: entry.isDirectory() ? 'FOLDER' : 'FILE',
            size: BigInt(stats.size),
            mimeType: entry.isFile() ? getMimeType(entry.name) : undefined,
            content: entry.isFile() && isTextFile(entry.name) ? await readFile(fullPath, 'utf-8') : null,
          },
        });
      }
      
      if (entry.isDirectory()) {
        await scanDir(fullPath, relPath);
      }
    }
  }
  
  await scanDir(basePath);
}

function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  const mimeTypes: Record<string, string> = {
    js: 'text/javascript',
    ts: 'text/typescript',
    tsx: 'text/typescript',
    jsx: 'text/javascript',
    py: 'text/x-python',
    java: 'text/x-java',
    html: 'text/html',
    css: 'text/css',
    json: 'application/json',
    yaml: 'text/yaml',
    yml: 'text/yaml',
    md: 'text/markdown',
    php: 'text/x-php',
    sh: 'text/x-shellscript',
    bash: 'text/x-shellscript',
    sql: 'text/x-sql',
    prisma: 'text/x-prisma',
    env: 'text/plain',
    txt: 'text/plain',
    toml: 'text/toml',
    ini: 'text/plain',
    cfg: 'text/plain',
    conf: 'text/plain',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    mp4: 'video/mp4',
    webm: 'video/webm',
    pdf: 'application/pdf',
    zip: 'application/zip',
    gz: 'application/gzip',
  };
  return mimeTypes[ext] ?? 'application/octet-stream';
}

function isTextFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  const textExts = [
    'js', 'ts', 'tsx', 'jsx', 'py', 'java', 'html', 'css', 'json', 'yaml', 'yml',
    'md', 'php', 'sh', 'bash', 'sql', 'prisma', 'env', 'txt', 'toml', 'ini',
    'cfg', 'conf', 'xml', 'csv', 'log'
  ];
  return textExts.includes(ext);
}

export async function getMediaStoragePath(): Promise<string> {
  await mkdir(MEDIA_STORAGE, { recursive: true });
  return MEDIA_STORAGE;
}

export async function saveMediaFile(file: File, filename: string): Promise<{ path: string; url: string; size: number }> {
  const mediaPath = await getMediaStoragePath();
  const fullPath = join(mediaPath, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(fullPath, buffer);
  
  return {
    path: filename,
    url: `/api/media/${filename}`,
    size: buffer.length,
  };
}

export async function deleteMediaFile(filename: string): Promise<void> {
  const mediaPath = await getMediaStoragePath();
  const fullPath = sanitizePath(mediaPath, join(mediaPath, filename));
  
  if (existsSync(fullPath)) {
    await unlink(fullPath);
  }
}