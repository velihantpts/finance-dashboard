import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [revenues, transactions, portfolio, riskScores] = await Promise.all([
      prisma.revenue.findMany(),
      prisma.transaction.findMany(),
      prisma.portfolioAllocation.findMany(),
      prisma.riskScore.findMany(),
    ]);

    // Calculate aggregated analytics
    const totalRevenue = revenues.reduce((sum, r) => sum + r.revenue, 0);
    const totalExpenses = revenues.reduce((sum, r) => sum + r.expenses, 0);
    const totalProfit = revenues.reduce((sum, r) => sum + r.profit, 0);
    const avgMonthlyProfit = totalProfit / (revenues.length || 1);

    const completedTxns = transactions.filter((t) => t.status === 'Completed');
    const totalTxnVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
    const settlementRate = transactions.length > 0 ? (completedTxns.length / transactions.length * 100) : 0;

    const avgRisk = riskScores.length > 0
      ? riskScores.reduce((sum, r) => sum + r.score, 0) / riskScores.length
      : 0;

    // Monthly performance for candlestick
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const candlestickData = revenues
      .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month))
      .map((r) => ({
        month: r.month,
        open: r.revenue * 0.95,
        close: r.revenue,
        high: r.revenue * 1.08,
        low: r.revenue * 0.88,
        profit: r.profit,
      }));

    // Funnel data
    const funnelData = {
      total: transactions.length,
      completed: completedTxns.length,
      settled: Math.floor(completedTxns.length * 0.92),
    };

    return NextResponse.json({
      data: {
        summary: {
          totalRevenue,
          totalExpenses,
          totalProfit,
          avgMonthlyProfit,
          totalTxnVolume,
          settlementRate,
          avgRisk: Math.round(avgRisk),
          totalTransactions: transactions.length,
        },
        candlestickData,
        funnelData,
        portfolio,
        riskScores,
      },
    });
  } catch (error) {
    console.error('GET /api/analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
