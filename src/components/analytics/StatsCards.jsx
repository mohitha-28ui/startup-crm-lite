import { ArrowUpRight, ArrowDownRight, Users, Target, Activity, DollarSign, Clock, AlertTriangle } from "lucide-react";

/**
 * Format helper for Indian Rupees localized formatting (Lakhs/Crores).
 *
 * @param {number} val - Amount.
 * @returns {string} Formatted string.
 */
function formatINR(val) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

/**
 * StatsCards component displaying 6 CRM key metrics.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.kpis - KPI state data from useAnalytics.
 * @returns {React.JSX.Element} The rendered StatsCards component.
 */
export function StatsCards({ kpis }) {
  const { totalLeads, conversionRate, pipelineValue, wonRevenue, avgSalesCycle, lostRate } = kpis;

  // Configuration for stats cards
  const cards = [
    {
      title: "Total Leads",
      value: totalLeads.value.toLocaleString("en-IN"),
      growth: totalLeads.growth,
      icon: Users,
      color: "blue",
      isLowerBetter: false,
      unit: "Leads",
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate.value}%`,
      growth: conversionRate.growth,
      icon: Target,
      color: "green",
      isLowerBetter: false,
      unit: "",
    },
    {
      title: "Pipeline Value",
      value: formatINR(pipelineValue.value),
      growth: pipelineValue.growth,
      icon: Activity,
      color: "amber",
      isLowerBetter: false,
      unit: "",
    },
    {
      title: "Won Revenue",
      value: formatINR(wonRevenue.value),
      growth: wonRevenue.growth,
      icon: DollarSign,
      color: "emerald",
      isLowerBetter: false,
      unit: "",
    },
    {
      title: "Average Sales Cycle",
      value: `${avgSalesCycle.value} Days`,
      growth: avgSalesCycle.growth,
      icon: Clock,
      color: "violet",
      isLowerBetter: true,
      unit: "",
    },
    {
      title: "Lost Rate",
      value: `${lostRate.value}%`,
      growth: lostRate.growth,
      icon: AlertTriangle,
      color: "rose",
      isLowerBetter: true,
      unit: "",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const growth = card.growth;
        const hasGrowth = growth !== 0;
        
        // Smart coloring: down is good for lost rate and sales cycle
        const isPositiveTrend = growth > 0;
        const isGoodTrend = card.isLowerBetter ? !isPositiveTrend : isPositiveTrend;
        const trendText = hasGrowth ? `${Math.abs(growth)}%` : "0%";

        const colorClasses = {
          blue: { bg: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/40", accent: "text-blue-500" },
          green: { bg: "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/40", accent: "text-green-500" },
          amber: { bg: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/40", accent: "text-amber-500" },
          emerald: { bg: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40", accent: "text-emerald-500" },
          violet: { bg: "bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-900/40", accent: "text-violet-500" },
          rose: { bg: "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/40", accent: "text-rose-500" },
        };

        const currentStyle = colorClasses[card.color] || colorClasses.blue;

        return (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-slate-200/60 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-slate-300/60 dark:hover:border-gray-700 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${currentStyle.bg}`}>
                <Icon size={16} />
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                {card.value}
              </h3>
              
              <div className="flex items-center gap-1 mt-2 text-xs">
                {hasGrowth && (
                  isGoodTrend ? (
                    <ArrowUpRight size={14} className="text-green-600 dark:text-green-400 font-bold" />
                  ) : (
                    <ArrowDownRight size={14} className="text-red-600 dark:text-red-400 font-bold" />
                  )
                )}
                <span
                  className={`font-semibold ${
                    !hasGrowth
                      ? "text-slate-400 dark:text-gray-500"
                      : isGoodTrend
                      ? "text-green-600 dark:text-green-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {trendText}
                </span>
                <span className="text-slate-400 dark:text-gray-500 font-medium ml-0.5">vs last period</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;
