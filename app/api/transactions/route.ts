import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') ?? '';
    const status = searchParams.get('status') ?? '';
    const risk   = searchParams.get('risk')   ?? '';
    const type   = searchParams.get('type')   ?? '';
    const page   = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit  = Math.min(100, parseInt(searchParams.get('limit') ?? '50'));

    const where = {
      AND: [
        search ? {
          OR: [
            { client: { contains: search, mode: 'insensitive' as const } },
            { asset:  { contains: search, mode: 'insensitive' as const } },
            { txnId:  { contains: search, mode: 'insensitive' as const } },
          ],
        } : {},
        status ? { status } : {},
        risk   ? { risk }   : {},
        type   ? { type }   : {},
      ],
    };

    const [data, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return NextResponse.json({ data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('[GET /api/transactions]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { client, type, asset, amount, status, risk, date } = body;

    if (!client || !type || !asset || !amount || !status || !risk || !date) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    if (amount <= 0) {
      return NextResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    const count = await prisma.transaction.count();
    const txnId = `TXN-${String(count + 1 + 7835).padStart(4, '0')}`;

    const transaction = await prisma.transaction.create({
      data: { txnId, client, type, asset, amount: parseFloat(amount), status, risk, date: new Date(date) },
    });

    return NextResponse.json({ data: transaction }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/transactions]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
