const YOUTUBE_RSS_BASE = 'https://www.youtube.com/feeds/videos.xml';
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || '';

export interface YouTubeRSSVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
}

function extractTag(xml: string, tag: string): string {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)<\\/${escaped}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`<${escaped}[^>]*\\s+${attr}=["']([^"']*)["']`, 'i');
  const match = xml.match(regex);
  return match ? match[1] : '';
}

export async function fetchChannelRSS(channelId?: string): Promise<YouTubeRSSVideo[]> {
  const id = channelId || YOUTUBE_CHANNEL_ID;
  if (!id) {
    console.error('YOUTUBE_CHANNEL_ID not set');
    return [];
  }

  try {
    const response = await fetch(`${YOUTUBE_RSS_BASE}?channel_id=${id}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error('YouTube RSS fetch failed:', response.status);
      return [];
    }

    const xml = await response.text();
    const entries = xml.split('<entry>').slice(1);

    return entries.map((entry) => {
      const videoId = extractTag(entry, 'yt:videoId');
      const title = extractTag(entry, 'title');
      const description = extractTag(entry, 'media:group') ?
        extractTag(extractTag(entry, 'media:group'), 'media:description') :
        extractTag(entry, 'content');
      const thumbnail = extractAttr(entry, 'media:thumbnail', 'url') ||
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      const publishedAt = extractTag(entry, 'published');
      const channelTitle = extractTag(entry, 'author') ?
        extractTag(extractTag(entry, 'author'), 'name') : '';

      return {
        videoId,
        title,
        description: description.replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
        thumbnail,
        publishedAt,
        channelTitle,
      };
    }).filter(v => v.videoId && v.title);
  } catch (error) {
    console.error('YouTube RSS error:', error);
    return [];
  }
}

export function getYouTubeCategoryId(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('minecraft') || text.includes('plugin') || text.includes('server')) return 'Minecraft';
  if (text.includes('react') || text.includes('javascript') || text.includes('typescript') || text.includes('coding') || text.includes('programming') || text.includes('code')) return 'Coding';
  if (text.includes('linux') || text.includes('ubuntu') || text.includes('debian') || text.includes('server') || text.includes('nginx')) return 'Linux';
  if (text.includes('hosting') || text.includes('vps') || text.includes('panel') || text.includes('host')) return 'Hosting';
  if (text.includes('game') || text.includes('gaming') || text.includes('play')) return 'Gaming';
  if (text.includes('tech') || text.includes('ai') || text.includes('review')) return 'Technology';
  return 'Technology';
}
