import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './database';

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'dev-secret-change-in-production'
);

const SESSION_COOKIE_NAME = 'sp_admin_session';
const SESSION_DURATION = process.env.ADMIN_SESSION_DURATION || '12h';

export interface SessionPayload {
  userId: string;
  role: string;
  permissions: string[];
  issuedAt: number;
}

export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(SESSION_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 12,
    path: '/',
  });

  return token;
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function verifyAdminKey(key: string): Promise<boolean> {
  const keyHash = await hashKey(key);
  const authKey = await prisma.adminAuthKey.findUnique({
    where: { keyHash },
  });

  if (!authKey) return false;
  if (authKey.status !== 'ACTIVE') return false;
  if (authKey.expiresAt < new Date()) return false;

  return true;
}

export async function consumeAdminKey(key: string): Promise<boolean> {
  const keyHash = await hashKey(key);
  const authKey = await prisma.adminAuthKey.findUnique({
    where: { keyHash },
  });

  if (!authKey) return false;
  if (authKey.status !== 'ACTIVE') return false;
  if (authKey.expiresAt < new Date()) return false;

  await prisma.adminAuthKey.update({
    where: { id: authKey.id },
    data: {
      status: 'USED',
      usedAt: new Date(),
    },
  });

  return true;
}

async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateAdminKey(): Promise<string> {
  const length = parseInt(process.env.ADMIN_KEY_LENGTH || '32', 10) || 32;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'SP-';
  const randomBytes = crypto.getRandomValues(new Uint8Array(length));
  for (let i = 0; i < length; i++) {
    key += chars[randomBytes[i] % chars.length];
  }
  return key;
}

export async function storeAdminKey(key: string, createdBy?: string): Promise<void> {
  const keyHash = await hashKey(key);
  const rotationHours = parseInt(process.env.ADMIN_KEY_ROTATION_HOURS || '24', 10) || 24;
  const expiresAt = new Date(Date.now() + rotationHours * 60 * 60 * 1000);

  await prisma.adminAuthKey.updateMany({
    where: { status: 'ACTIVE' },
    data: { status: 'REVOKED', revokedAt: new Date() },
  });

  await prisma.adminAuthKey.create({
    data: {
      keyHash,
      expiresAt,
      createdBy,
    },
  });
}

export async function getActiveAdminKey(): Promise<{ key: string; expiresAt: Date } | null> {
  const authKey = await prisma.adminAuthKey.findFirst({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
  });

  if (!authKey) return null;

  return {
    key: '', // Never return the actual key
    expiresAt: authKey.expiresAt,
  };
}

export async function revokeAdminKey(): Promise<void> {
  await prisma.adminAuthKey.updateMany({
    where: { status: 'ACTIVE' },
    data: { status: 'REVOKED', revokedAt: new Date() },
  });
}

export async function rotateAdminKey(createdBy?: string): Promise<string> {
  await revokeAdminKey();
  const newKey = await generateAdminKey();
  await storeAdminKey(newKey, createdBy);
  return newKey;
}