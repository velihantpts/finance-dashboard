import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.riskScore.findMany();
    return NextResponse.json({ data });
  } catch (err) {
    console.error('[GET /api/risk-scores]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
