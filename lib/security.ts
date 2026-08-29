import { prisma } from './database';
import { sendSecurityAlert } from './discord';

const MAX_ATTEMPTS = parseInt(process.env.ADMIN_AUTH_MAX_ATTEMPTS ?? '5', 10);
const LOCKOUT_MINUTES = parseInt(process.env.ADMIN_AUTH_LOCKOUT_MINUTES ?? '15', 10);

const attemptStore = new Map<string, { count: number; lockedUntil: number }>();

export async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number; resetAt?: number }> {
  const now = Date.now();
  const record = attemptStore.get(ip);
  
  if (record) {
    if (record.lockedUntil > now) {
      return { allowed: false, remaining: 0, resetAt: record.lockedUntil };
    }
    if (record.count >= MAX_ATTEMPTS) {
      record.lockedUntil = now + LOCKOUT_MINUTES * 60 * 1000;
      await logSecurityEvent('RATE_LIMIT_EXCEEDED', 'warning', `Rate limit exceeded for IP: ${ip}`, { ip });
      return { allowed: false, remaining: 0, resetAt: record.lockedUntil };
    }
  }
  
  return { allowed: true, remaining: MAX_ATTEMPTS - (record?.count ?? 0) };
}

export async function recordFailedAttempt(ip: string): Promise<void> {
  const now = Date.now();
  const record = attemptStore.get(ip) ?? { count: 0, lockedUntil: 0 };
  record.count += 1;
  attemptStore.set(ip, record);
  
  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MINUTES * 60 * 1000;
    await logSecurityEvent('RATE_LIMIT_EXCEEDED', 'warning', `Rate limit exceeded for IP: ${ip}`, { ip, attempts: record.count });
  }
}

export async function recordSuccessfulAttempt(ip: string): Promise<void> {
  attemptStore.delete(ip);
}

export async function logSecurityEvent(
  type: string,
  severity: 'info' | 'warning' | 'critical',
  message: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await prisma.securityEvent.create({
    data: {
      type: type as any,
      severity: severity.toUpperCase() as any,
      message,
      metadata: metadata as any,
    },
  });
  
  if (severity === 'critical' || severity === 'warning') {
    await sendSecurityAlert(type, message, metadata, severity);
  }
}

export async function logAudit(
  action: string,
  resource: string,
  options: {
    resourceId?: string;
    userId?: string;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
    result?: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
  } = {}
): Promise<void> {
  await prisma.auditLog.create({
    data: {
      action,
      resource,
      resourceId: options.resourceId,
      userId: options.userId,
      sessionId: options.sessionId,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      metadata: options.metadata as any,
      result: options.result ?? 'SUCCESS',
    },
  });
}

export async function createNotification(
  type: string,
  title: string,
  message: string,
  data?: Record<string, unknown>
): Promise<void> {
  await prisma.notification.create({
    data: {
      type: type as any,
      title,
      message,
      data: data as any,
    },
  });
}

export async function getSystemHealth(): Promise<{
  nodejs: boolean;
  nextjs: boolean;
  database: boolean;
  discord: boolean;
  youtube: boolean;
  storage: boolean;
  cpu: number;
  memory: { used: number; total: number; percentage: number };
  disk: { used: number; total: number; percentage: number };
  uptime: number;
  apiLatency: number;
  dbLatency: number;
}> {
  const startDb = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    // Database check failed
  }
  const dbLatency = Date.now() - startDb;
  
  const mem = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  return {
    nodejs: true,
    nextjs: true,
    database: dbLatency < 1000,
    discord: !!process.env.DISCORD_ADMIN_WEBHOOK_URL,
    youtube: !!process.env.YOUTUBE_API_KEY,
    storage: true,
    cpu: (cpuUsage.user + cpuUsage.system) / 1000000,
    memory: {
      used: mem.heapUsed,
      total: mem.heapTotal,
      percentage: (mem.heapUsed / mem.heapTotal) * 100,
    },
    disk: { used: 0, total: 0, percentage: 0 },
    uptime: process.uptime(),
    apiLatency: 0,
    dbLatency,
  };
}

export async function emergencyLockdown(): Promise<void> {
  await prisma.adminSession.updateMany({
    where: { revokedAt: null },
    data: { revokedAt: new Date() },
  });
  
  await prisma.adminAuthKey.updateMany({
    where: { status: 'ACTIVE' },
    data: { status: 'REVOKED', revokedAt: new Date() },
  });
  
  await prisma.adminSetting.upsert({
    where: { key: 'maintenance_mode' },
    update: { value: true },
    create: { key: 'maintenance_mode', value: true },
  });
  
  await logSecurityEvent('ADMIN_LOCKDOWN_ACTIVATED', 'critical', 'Emergency lockdown activated - all sessions revoked, auth keys revoked, maintenance mode enabled');
}