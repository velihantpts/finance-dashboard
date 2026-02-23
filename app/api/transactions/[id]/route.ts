import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: transaction });
  } catch (err) {
    console.error('[GET /api/transactions/[id]]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { client, type, asset, amount, status, risk, date } = body;

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        ...(client && { client }),
        ...(type && { type }),
        ...(asset && { asset }),
        ...(amount && { amount: parseFloat(amount) }),
        ...(status && { status }),
        ...(risk && { risk }),
        ...(date && { date: new Date(date) }),
      },
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error('[PUT /api/transactions/[id]]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.transaction.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    console.error('[DELETE /api/transactions/[id]]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
