import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { tasks: true, files: true, notes: true, changelog: true, roadmapItems: true, flowchart: true },
  });
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updateData: Record<string, any> = {};

  if (body.name !== undefined) updateData.name = body.name;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.longDescription !== undefined) updateData.longDescription = body.longDescription;
  if (body.icon !== undefined) updateData.icon = body.icon;
  if (body.coverImage !== undefined) updateData.coverImage = body.coverImage;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.category !== undefined) updateData.category = body.category;
  if (body.technologies !== undefined) updateData.technologies = body.technologies;
  if (body.githubUrl !== undefined) updateData.githubUrl = body.githubUrl;
  if (body.demoUrl !== undefined) updateData.demoUrl = body.demoUrl;
  if (body.websiteUrl !== undefined) updateData.websiteUrl = body.websiteUrl;
  if (body.featured !== undefined) updateData.featured = body.featured;
  if (body.visibility !== undefined) updateData.visibility = body.visibility;
  if (body.showOnRoadmap !== undefined) updateData.showOnRoadmap = body.showOnRoadmap;
  if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;

  const project = await prisma.project.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(project);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
