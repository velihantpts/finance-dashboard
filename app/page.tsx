'use client';

import { Suspense } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import KpiGrid from '@/components/cards/KpiGrid';
import RevenueChart from '@/components/charts/RevenueChart';
import PortfolioChart from '@/components/charts/PortfolioChart';
import RiskAssessment from '@/components/risk/RiskAssessment';
import WeeklyVolume from '@/components/charts/WeeklyVolume';
import QuickStats from '@/components/cards/QuickStats';
import ProfitChart from '@/components/charts/ProfitChart';
import AiInsights from '@/components/cards/AiInsights';
import TransactionTable from '@/components/tables/TransactionTable';
import DraggableGrid from '@/components/ui/DraggableGrid';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { useLanguage } from '@/providers/LanguageProvider';
import { Move, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sections: Record<string, React.ReactNode> = {
  'kpi-grid': (
    <div data-tour="kpi">
      <KpiGrid />
    </div>
  ),
  'charts-row-1': (
    <div data-tour="charts" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <RevenueChart />
      </div>
      <PortfolioChart />
    </div>
  ),
  'charts-row-2': (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <RiskAssessment />
      <div className="space-y-6">
        <WeeklyVolume />
        <QuickStats />
      </div>
      <ProfitChart />
    </div>
  ),
  'charts-row-3': (
    <div data-tour="table" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Suspense fallback={null}>
          <TransactionTable />
        </Suspense>
      </div>
      <AiInsights />
    </div>
  ),
};

export default function Dashboard() {
  const { order, updateOrder, editMode, toggleEditMode, resetLayout } = useDashboardLayout();
  const { lang } = useLanguage();

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Edit mode toolbar */}
        <div className="flex items-center justify-end gap-2 mb-4">
          {editMode && (
            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={resetLayout}>
              <RotateCcw size={12} />
              {lang === 'tr' ? 'Sıfırla' : 'Reset'}
            </Button>
          )}
          <Button
            variant={editMode ? 'default' : 'outline'}
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={toggleEditMode}
          >
            <Move size={12} />
            {editMode
              ? (lang === 'tr' ? 'Düzenlemeyi Bitir' : 'Done Editing')
              : (lang === 'tr' ? 'Düzeni Düzenle' : 'Edit Layout')}
          </Button>
        </div>

        <DraggableGrid
          order={order}
          onReorder={updateOrder}
          editMode={editMode}
          sections={sections}
        />
      </div>
    </DashboardLayout>
  );
}
