import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  const projects = await prisma.project.findMany({
    where: { visibility: 'PUBLIC' },
    orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { updatedAt: 'desc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      longDescription: true,
      icon: true,
      coverImage: true,
      status: true,
      category: true,
      technologies: true,
      githubUrl: true,
      demoUrl: true,
      websiteUrl: true,
      featured: true,
      showOnRoadmap: true,
      sortOrder: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(projects);
}