import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.portfolioAllocation.findMany();
    return NextResponse.json({ data });
  } catch (err) {
    console.error('[GET /api/portfolio]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
