import { prisma } from './database';

const WEBHOOK_URL = process.env.DISCORD_ADMIN_WEBHOOK_URL;

interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  footer?: { text: string; icon_url?: string };
  timestamp?: string;
  url?: string;
}

interface DiscordMessage {
  content?: string;
  embeds?: DiscordEmbed[];
  username?: string;
  avatar_url?: string;
}

async function sendWebhook(message: DiscordMessage): Promise<boolean> {
  if (!WEBHOOK_URL) {
    console.warn('Discord webhook URL not configured');
    return false;
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error('Discord webhook failed:', response.status, await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('Discord webhook error:', error);
    return false;
  }
}

export async function sendAdminKeyNotification(key: string, adminUrl: string, expiresAt: Date): Promise<void> {
  const embed: DiscordEmbed = {
    title: '🔐 SUBHANPLAYS ADMIN ACCESS',
    description: 'New authentication key generated',
    color: 0x5865F2,
    fields: [
      { name: 'Authentication Key', value: `\`${key}\``, inline: false },
      { name: 'Admin Panel', value: adminUrl, inline: false },
      { name: 'Expires', value: expiresAt.toISOString(), inline: true },
    ],
    footer: { text: '⚠️ Keep this message private. Do not share.' },
    timestamp: new Date().toISOString(),
  };

  await sendWebhook({
    embeds: [embed],
    username: 'SubhanPlays Security',
    avatar_url: 'https://subhanplays.qzz.io/favicon.ico',
  });
}

export async function sendSecurityAlert(
  type: string,
  message: string,
  metadata?: Record<string, unknown>,
  severity: 'info' | 'warning' | 'critical' = 'info'
): Promise<void> {
  const colors = { info: 0x5865F2, warning: 0xFFA500, critical: 0xFF0000 };
  const icons = { info: 'ℹ️', warning: '⚠️', critical: '🚨' };

  const embed: DiscordEmbed = {
    title: `${icons[severity]} Security Alert: ${type}`,
    description: message,
    color: colors[severity],
    fields: metadata ? [{ name: 'Details', value: `\`\`\`json\n${JSON.stringify(metadata, null, 2)}\n\`\`\``, inline: false }] : [],
    timestamp: new Date().toISOString(),
  };

  await sendWebhook({ embeds: [embed] });
}

export async function sendNotification(
  type: string,
  title: string,
  message: string,
  data?: Record<string, unknown>
): Promise<void> {
  const typeColors: Record<string, number> = {
    video: 0xFF0000,
    project: 0x5865F2,
    file: 0x00FF00,
    webhook: 0xFFA500,
    backup: 0x800080,
    system: 0x00FFFF,
    security: 0xFF0000,
  };

  const embed: DiscordEmbed = {
    title,
    description: message,
    color: typeColors[type] ?? 0x5865F2,
    fields: data ? [{ name: 'Data', value: `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``, inline: false }] : [],
    timestamp: new Date().toISOString(),
  };

  await sendWebhook({ embeds: [embed] });
}

export async function testWebhook(): Promise<boolean> {
  const embed: DiscordEmbed = {
    title: '✅ Webhook Test Successful',
    description: 'Discord integration is working correctly.',
    color: 0x00FF00,
    timestamp: new Date().toISOString(),
  };

  return sendWebhook({ embeds: [embed] });
}