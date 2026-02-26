import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const schedules = await prisma.scheduledReport.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ data: schedules });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { name, frequency, email, reportType } = body;

  if (!name || !frequency || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Calculate nextRun based on frequency
  const now = new Date();
  let nextRun = new Date(now);
  switch (frequency) {
    case 'daily':
      nextRun.setDate(nextRun.getDate() + 1);
      nextRun.setHours(8, 0, 0, 0);
      break;
    case 'weekly':
      nextRun.setDate(nextRun.getDate() + 7);
      nextRun.setHours(8, 0, 0, 0);
      break;
    case 'monthly':
      nextRun.setMonth(nextRun.getMonth() + 1);
      nextRun.setDate(1);
      nextRun.setHours(8, 0, 0, 0);
      break;
  }

  const schedule = await prisma.scheduledReport.create({
    data: {
      userId: session.user.id,
      name,
      frequency,
      email,
      reportType: reportType || 'general',
      nextRun,
    },
  });

  return NextResponse.json({ data: schedule }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { id, active } = body;

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const schedule = await prisma.scheduledReport.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!schedule) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const updated = await prisma.scheduledReport.update({
    where: { id },
    data: { active: typeof active === 'boolean' ? active : schedule.active },
  });

  return NextResponse.json({ data: updated });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const schedule = await prisma.scheduledReport.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!schedule) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.scheduledReport.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
