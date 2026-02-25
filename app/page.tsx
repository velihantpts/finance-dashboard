import { Suspense } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import KpiGrid from '@/components/cards/KpiGrid';
import RevenueChart from '@/components/charts/RevenueChart';
import PortfolioChart from '@/components/charts/PortfolioChart';
import RiskAssessment from '@/components/risk/RiskAssessment';
import WeeklyVolume from '@/components/charts/WeeklyVolume';
import QuickStats from '@/components/cards/QuickStats';
import ProfitChart from '@/components/charts/ProfitChart';
import TransactionTable from '@/components/tables/TransactionTable';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <KpiGrid />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <RevenueChart />
          </div>
          <PortfolioChart />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <RiskAssessment />
          <div className="space-y-6">
            <WeeklyVolume />
            <QuickStats />
          </div>
          <ProfitChart />
        </div>

        <Suspense fallback={null}>
          <TransactionTable />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
