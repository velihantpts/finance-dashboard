import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Insight {
  id: string;
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  metric?: string;
}

export async function GET() {
  try {
    const [revenues, riskScores, transactions, kpis] = await Promise.all([
      prisma.revenue.findMany(),
      prisma.riskScore.findMany(),
      prisma.transaction.findMany({ orderBy: { date: 'desc' }, take: 100 }),
      prisma.kpiMetric.findMany(),
    ]);

    const insights: Insight[] = [];

    // Revenue trend analysis
    if (revenues.length >= 2) {
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const sorted = [...revenues].sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
      const lastTwo = sorted.slice(-2);
      if (lastTwo.length === 2) {
        const change = ((lastTwo[1].profit - lastTwo[0].profit) / lastTwo[0].profit * 100).toFixed(1);
        const isPositive = lastTwo[1].profit > lastTwo[0].profit;
        insights.push({
          id: 'revenue-trend',
          type: isPositive ? 'positive' : 'negative',
          title: isPositive ? 'Revenue Growth Detected' : 'Revenue Decline Alert',
          description: `Profit ${isPositive ? 'increased' : 'decreased'} by ${Math.abs(parseFloat(change))}% compared to the previous month. ${isPositive ? 'Strong upward momentum.' : 'Consider reviewing expense allocations.'}`,
          metric: `${change}%`,
        });
      }
    }

    // Risk score alerts
    for (const risk of riskScores) {
      if (risk.score > 65) {
        insights.push({
          id: `risk-${risk.category}`,
          type: 'negative',
          title: `High ${risk.category} Alert`,
          description: `${risk.category} score is at ${risk.score}/100, exceeding the recommended threshold of 65. ${risk.score > risk.previous ? `Up from ${risk.previous} — trend is worsening.` : `Down from ${risk.previous} — showing improvement.`}`,
          metric: `${risk.score}/100`,
        });
      } else if (risk.score < risk.previous) {
        insights.push({
          id: `risk-improved-${risk.category}`,
          type: 'positive',
          title: `${risk.category} Improvement`,
          description: `${risk.category} score improved from ${risk.previous} to ${risk.score}. Risk exposure is decreasing.`,
          metric: `-${risk.previous - risk.score} pts`,
        });
      }
    }

    // Transaction volume anomaly
    if (transactions.length > 0) {
      const completed = transactions.filter((t) => t.status === 'Completed').length;
      const failed = transactions.filter((t) => t.status === 'Failed').length;
      const failRate = (failed / transactions.length * 100).toFixed(1);

      if (parseFloat(failRate) > 5) {
        insights.push({
          id: 'txn-fail-rate',
          type: 'negative',
          title: 'Elevated Failure Rate',
          description: `Transaction failure rate is ${failRate}% (${failed} out of ${transactions.length}). This exceeds the normal threshold of 5%.`,
          metric: `${failRate}%`,
        });
      } else {
        insights.push({
          id: 'txn-health',
          type: 'positive',
          title: 'Healthy Transaction Flow',
          description: `${completed} out of ${transactions.length} recent transactions completed successfully. Settlement rate is strong.`,
          metric: `${(completed / transactions.length * 100).toFixed(1)}%`,
        });
      }
    }

    // Portfolio diversification
    const portfolio = await prisma.portfolioAllocation.findMany();
    if (portfolio.length > 0) {
      const maxAlloc = Math.max(...portfolio.map((p) => p.value));
      const topAsset = portfolio.find((p) => p.value === maxAlloc);
      if (maxAlloc > 45) {
        insights.push({
          id: 'portfolio-concentration',
          type: 'neutral',
          title: 'Portfolio Concentration Notice',
          description: `${topAsset?.name} represents ${maxAlloc}% of the portfolio. Consider rebalancing for better diversification.`,
          metric: `${maxAlloc}%`,
        });
      }
    }

    // KPI momentum
    const aumKpi = kpis.find((k) => k.key === 'total_aum');
    if (aumKpi && aumKpi.trend === 'up') {
      insights.push({
        id: 'aum-momentum',
        type: 'positive',
        title: 'AUM Growth Momentum',
        description: `Total Assets Under Management reached ${aumKpi.value} with ${aumKpi.change} growth. Client acquisition strategy is working.`,
        metric: aumKpi.change,
      });
    }

    return NextResponse.json({ data: insights.slice(0, 6) });
  } catch (error) {
    console.error('GET /api/insights error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
