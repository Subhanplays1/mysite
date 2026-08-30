import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
  });
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, description, longDescription, icon, coverImage, category, status, technologies, githubUrl, demoUrl, websiteUrl, featured, visibility, showOnRoadmap } = body;

  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const existingSlug = await prisma.project.findUnique({ where: { slug } });
  const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

  const maxOrder = await prisma.project.aggregate({ _max: { sortOrder: true } });
  const nextOrder = (maxOrder._max.sortOrder ?? -1) + 1;

  const project = await prisma.project.create({
    data: {
      name,
      slug: finalSlug,
      description: description || null,
      longDescription: longDescription || null,
      icon: icon || null,
      coverImage: coverImage || null,
      category: category || null,
      status: status || 'IDEA',
      technologies: technologies || [],
      githubUrl: githubUrl || null,
      demoUrl: demoUrl || null,
      websiteUrl: websiteUrl || null,
      featured: featured || false,
      visibility: visibility || 'PRIVATE',
      showOnRoadmap: showOnRoadmap || false,
      sortOrder: nextOrder,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
