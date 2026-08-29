const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideoData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  tags: string[];
  categoryId: string;
}

export async function fetchVideoFromYouTube(youtubeId: string): Promise<YouTubeVideoData | null> {
  if (!YOUTUBE_API_KEY) return null;

  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE}/videos?part=snippet,statistics,contentDetails&id=${youtubeId}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      console.error('YouTube API error:', response.status);
      return null;
    }

    const data = await response.json();
    const item = data.items?.[0];

    if (!item) return null;

    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.maxres?.url ?? item.snippet.thumbnails.high?.url ?? item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      viewCount: parseInt(item.statistics.viewCount ?? '0', 10),
      tags: item.snippet.tags ?? [],
      categoryId: item.snippet.categoryId,
    };
  } catch (error) {
    console.error('YouTube fetch error:', error);
    return null;
  }
}

export async function fetchChannelVideos(channelId: string, maxResults = 50): Promise<YouTubeVideoData[]> {
  if (!YOUTUBE_API_KEY) return [];

  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) return [];

    const data = await response.json();
    const videoIds = data.items?.map((item: any) => item.id.videoId).join(',') ?? '';

    if (!videoIds) return [];

    const detailsResponse = await fetch(
      `${YOUTUBE_API_BASE}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );

    if (!detailsResponse.ok) return [];

    const detailsData = await detailsResponse.json();

    return detailsData.items?.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.maxres?.url ?? item.snippet.thumbnails.high?.url ?? item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      viewCount: parseInt(item.statistics.viewCount ?? '0', 10),
      tags: item.snippet.tags ?? [],
      categoryId: item.snippet.categoryId,
    })) ?? [];
  } catch (error) {
    console.error('YouTube channel fetch error:', error);
    return [];
  }
}

export function getCategoryName(categoryId: string): string {
  const categories: Record<string, string> = {
    '1': 'Film & Animation',
    '2': 'Autos & Vehicles',
    '10': 'Music',
    '15': 'Pets & Animals',
    '17': 'Sports',
    '18': 'Short Movies',
    '19': 'Travel & Events',
    '20': 'Gaming',
    '21': 'Videoblogging',
    '22': 'People & Blogs',
    '23': 'Comedy',
    '24': 'Entertainment',
    '25': 'News & Politics',
    '26': 'Howto & Style',
    '27': 'Education',
    '28': 'Science & Technology',
    '29': 'Nonprofits & Activism',
    '30': 'Movies',
    '31': 'Anime/Animation',
    '32': 'Action/Adventure',
    '33': 'Classics',
    '34': 'Comedy',
    '35': 'Documentary',
    '36': 'Drama',
    '37': 'Family',
    '38': 'Foreign',
    '39': 'Horror',
    '40': 'Sci-Fi/Fantasy',
    '41': 'Thriller',
    '42': 'Shorts',
    '43': 'Shows',
    '44': 'Trailers',
  };
  return categories[categoryId] ?? 'Other';
}