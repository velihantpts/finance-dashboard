import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MONTH_ORDER = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export async function GET() {
  try {
    const data = await prisma.revenue.findMany();
    data.sort((a, b) => MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month));
    return NextResponse.json({ data });
  } catch (err) {
    console.error('[GET /api/revenue]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
