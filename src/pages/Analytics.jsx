import { useState, useEffect } from "react";
import { useLeads } from "../context/LeadContext";
import { useAnalytics } from "../hooks/useAnalytics";
import AnalyticsFilters from "../components/analytics/AnalyticsFilters";
import StatsCards from "../components/analytics/StatsCards";
import PieChartCard from "../components/analytics/PieChartCard";
import BarChartCard from "../components/analytics/BarChartCard";
import LineChartCard from "../components/analytics/LineChartCard";
import FunnelChartCard from "../components/analytics/FunnelChartCard";
import RevenueChartCard from "../components/analytics/RevenueChartCard";
import LeadSourceChart from "../components/analytics/LeadSourceChart";
import ActivityHeatmap from "../components/analytics/ActivityHeatmap";
import TopPerformersCard from "../components/analytics/TopPerformersCard";
import ForecastCard from "../components/analytics/ForecastCard";
import SalesVelocityCard from "../components/analytics/SalesVelocityCard";
import LoadingSkeleton from "../components/analytics/LoadingSkeleton";
import { BarChart2 } from "lucide-react";

/**
 * Analytics page component for Startup CRM Lite.
 * Integrates comprehensive metrics, filters, charts, and forecasts.
 *
 * @component
 * @returns {React.JSX.Element} The rendered Analytics page.
 */
export function Analytics() {
  const { leads = [] } = useLeads();
  const {
    filterRange,
    setFilterRange,
    customRange,
    setCustomRange,
    analytics,
  } = useAnalytics();

  const [isLoading, setIsLoading] = useState(true);

  // Loading animation on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Handle empty state when there are no leads
  if (leads.length === 0) {
    return (
      <div className="p-6 bg-slate-50 dark:bg-gray-950 min-h-screen flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-full mb-4 animate-bounce">
          <BarChart2 size={40} className="stroke-[1.5]" />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white text-xl">No analytics available yet</h3>
        <p className="text-sm text-slate-500 dark:text-gray-400 mt-2 max-w-sm">
          Add your first lead to start tracking business pipeline performance.
        </p>
      </div>
    );
  }

  // Render loading skeleton
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="p-6 bg-slate-50 dark:bg-gray-950 min-h-screen space-y-6 transition-colors duration-200">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 dark:border-gray-850 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Analytics Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
            Sales pipeline performance, win conversion trends, and cycle health.
          </p>
        </div>
      </div>

      {/* Date Range Filters */}
      <AnalyticsFilters
        filterRange={filterRange}
        onRangeChange={setFilterRange}
        customRange={customRange}
        onCustomRangeChange={setCustomRange}
      />

      {/* Summary KPI Stats (Row of 6) */}
      <StatsCards kpis={analytics.kpis} />

      {/* Primary Conversion & Acquisition Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PieChartCard data={analytics.statusDistribution} />
        <BarChartCard data={analytics.monthlyLeads} />
        <div className="md:col-span-2 lg:col-span-1">
          <LineChartCard data={analytics.monthlyConversion} />
        </div>
      </div>

      {/* Funnel & Revenue Area Timelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FunnelChartCard data={analytics.funnelData} />
        <RevenueChartCard data={analytics.monthlyRevenue} />
      </div>

      {/* Sources & Representatives Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LeadSourceChart data={analytics.leadSources} />
        <TopPerformersCard data={analytics.topPerformers} />
      </div>

      {/* Forecasting & Conversion Velocity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ForecastCard value={analytics.forecastRevenue} leads={leads} />
        <SalesVelocityCard data={analytics.salesVelocity} />
      </div>

      {/* Sales Activities Heatmap */}
      <div className="w-full">
        <ActivityHeatmap data={analytics.heatmapData} />
      </div>
    </div>
  );
}

export default Analytics;
