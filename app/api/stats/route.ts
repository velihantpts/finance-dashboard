import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({ select: { amount: true, status: true } }),
      prisma.transaction.count(),
    ]);

    const completed = transactions.filter((t) => t.status === 'Completed').length;
    const pending   = transactions.filter((t) => t.status === 'Pending').length;
    const failed    = transactions.filter((t) => t.status === 'Failed').length;

    const totalAmount = transactions.reduce((acc, t) => acc + t.amount, 0);
    const avgTransaction = totalCount > 0 ? totalAmount / totalCount : 0;
    const settlementRate = totalCount > 0 ? (completed / totalCount) * 100 : 0;

    return NextResponse.json({
      data: {
        avgTransaction,
        settlementRate: parseFloat(settlementRate.toFixed(1)),
        completed,
        pending,
        failed,
        total: totalCount,
      },
    });
  } catch (err) {
    console.error('[GET /api/stats]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
