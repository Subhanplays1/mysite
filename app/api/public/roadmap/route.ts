import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  const items = await prisma.roadmapItem.findMany({
    where: {
      project: { visibility: 'PUBLIC', showOnRoadmap: true },
    },
    include: {
      project: { select: { id: true, name: true, slug: true, status: true, category: true } },
    },
    orderBy: [{ status: 'asc' }, { targetDate: 'asc' }, { sortOrder: 'asc' }],
  });

  return NextResponse.json(items);
}