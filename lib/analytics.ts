import { prisma } from './database';

export async function trackEvent(
  event: string,
  data: {
    page?: string;
    referrer?: string;
    device?: string;
    browser?: string;
    os?: string;
    country?: string;
    region?: string;
    city?: string;
    metadata?: Record<string, unknown>;
    sessionId: string;
  }
): Promise<void> {
  await prisma.analyticsEvent.create({
    data: {
      event,
      page: data.page,
      referrer: data.referrer,
      device: data.device,
      browser: data.browser,
      os: data.os,
      country: data.country,
      region: data.region,
      city: data.city,
      metadata: data.metadata as any,
      sessionId: data.sessionId,
    },
  });
}

export async function getAnalyticsSummary(days: number): Promise<{
  totalViews: number;
  uniqueVisitors: number;
  topPages: Array<{ page: string; views: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
  devices: Array<{ device: string; count: number }>;
  browsers: Array<{ browser: string; count: number }>;
  countries: Array<{ country: string; count: number }>;
  trends: Array<{ date: string; views: number; visitors: number }>;
}> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  const events = await prisma.analyticsEvent.findMany({
    where: { createdAt: { gte: since } },
    select: { event: true, page: true, referrer: true, device: true, browser: true, country: true, sessionId: true, createdAt: true },
  });
  
  const pageViews = events.filter(e => e.event === 'page_view');
  const sessions = new Set(pageViews.map(e => e.sessionId));
  
  const pageCounts = new Map<string, number>();
  const referrerCounts = new Map<string, number>();
  const deviceCounts = new Map<string, number>();
  const browserCounts = new Map<string, number>();
  const countryCounts = new Map<string, number>();
  const dailyStats = new Map<string, { views: number; visitors: Set<string> }>();
  
  for (const e of pageViews) {
    const page = e.page ?? 'unknown';
    pageCounts.set(page, (pageCounts.get(page) ?? 0) + 1);
    
    if (e.referrer) {
      referrerCounts.set(e.referrer, (referrerCounts.get(e.referrer) ?? 0) + 1);
    }
    
    if (e.device) {
      deviceCounts.set(e.device, (deviceCounts.get(e.device) ?? 0) + 1);
    }
    
    if (e.browser) {
      browserCounts.set(e.browser, (browserCounts.get(e.browser) ?? 0) + 1);
    }
    
    if (e.country) {
      countryCounts.set(e.country, (countryCounts.get(e.country) ?? 0) + 1);
    }
    
    const date = e.createdAt.toISOString().split('T')[0];
    const day = dailyStats.get(date) ?? { views: 0, visitors: new Set() };
    day.views++;
    day.visitors.add(e.sessionId);
    dailyStats.set(date, day);
  }
  
  return {
    totalViews: pageViews.length,
    uniqueVisitors: sessions.size,
    topPages: Array.from(pageCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([page, views]) => ({ page, views })),
    topReferrers: Array.from(referrerCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer, count })),
    devices: Array.from(deviceCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([device, count]) => ({ device, count })),
    browsers: Array.from(browserCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([browser, count]) => ({ browser, count })),
    countries: Array.from(countryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([country, count]) => ({ country, count })),
    trends: Array.from(dailyStats.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, stats]) => ({ date, views: stats.views, visitors: stats.visitors.size })),
  };
}